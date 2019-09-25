import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1; /*vai ocupar todo espaco possivel! */
    border: 1px solid #eee;
    padding: 10px 15px; /*10px vertical e 15 px horizontal */
    border-radius: 4px;
    font-size: 16px;
  }
`;

const rotate = keyframes`
  from{
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  /* associando a prop disabled com a prop loading */
  disabled: props.loading,
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  /*&:focus{} quando o cursos estiver encima*/

  &[disabled] {
    /*somente aplicado qnd disabled:'true' */
    cursor: not-allowed;
    opacity: 0.6;
  }

  /*
  svg {
    animation: ${rotate} 2s linear infinite;
  } se utilizássemos cruamente assim até o ícone de adicionar
  giraria infinitamente, entao faremos como mostrado a seguir: */
  /*o que vier depois do && somente acontece se o que estiver
  antes do && for true */
  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    /*aplica em todos li com exceção do primeiro */
    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #7159c1;
      text-decoration: none;
    }
  }
`;
