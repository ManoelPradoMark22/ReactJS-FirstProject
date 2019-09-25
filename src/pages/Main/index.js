import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados no localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    /* armazenando o valor do input dentro da
    variável newRepo */

    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { newRepo, repositories } = this.state;

    if (newRepo.length === 0) {
      return;
    }

    this.setState({ loading: true });

    try {
      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('O repositório não existe!');
      this.setState({
        newRepo: '',
        loading: false,
      });
    }
  };

  render() {
    const { newRepo, repositories, loading } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            /* O primeiro elemento que vem depois (e dentro) de um .map(),
            no React, precisa de especificar uma key. */
            <li key={repository.name}>
              <a
                className="repoLink"
                href={`https://github.com/${repository.name}`}
                target="_blank"
              >
                {repository.name}
              </a>
              {/* <a href="/repository">Detalhes</a> assim iria recarregar a pg!!
            entao utilizaremos o Link. perceba que precisaremos utilizar o encode,
          já q no nome do repositorio tem uma / , entao o encode irá trocar a /
          por %2F */}
              <Link
                className="detailsLink"
                to={`/repository/${encodeURIComponent(repository.name)}`}
              >
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
