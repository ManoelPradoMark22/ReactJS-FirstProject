import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from './styles';

export default class Repository extends Component {
  static propTypes = {
    /* propriedades criadas automaticamente pelo react-router-dom */
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {}, // como é um unico repositorio, inicaremos como um objeto e nao como array
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    /* por causa do await, a segunda linha so vai executar após a primeira
    finalizar, e nao faz sentido esperar ate que a primeira finalize a execucao
    para a 2ª ser executada.
    const response = await api.get(`/repos/${repoName}`);
    const issues = await api.get(`/repos/${repoName}/issues`);
    !Entao faremos da seguinte forma: as duas vão ser executadas ao mesmo tempo
    e so vai passar pra proxima após ambas terminarem */

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`), // primeira posicao do array
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }), // segunda posicao do array
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state; // somente para o eslint nao apontar erro
    const { match } = this.props;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Home</Link>
          <div>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <a
              className="repoLink"
              href={`https://github.com/${decodeURIComponent(
                match.params.repository
              )}`}
              target="_blank"
            >
              {repository.name}
            </a>
            <p>{repository.description}</p>
          </div>
        </Owner>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url} target="_blank">
                    {issue.title}
                  </a>
                  {/* LABELS */}
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}
