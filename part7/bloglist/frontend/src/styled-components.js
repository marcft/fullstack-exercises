import styled from 'styled-components'

export const Title = styled.h1`
  font-size: 34px;
  text-align: center;
  margin-top: 0;
  padding-top: 10px;
  color: white;
`
export const Button = styled.button`
  background-color: white;
  color: darkmagenta;
  border: 2px solid darkmagenta;
  border-radius: 5px;
  padding: 5px 10px;

  &:hover {
    filter: brightness(0.85);
    cursor: pointer;
  }
`

export const Input = styled.input`
  padding: 5px;
  border: 2px solid darkmagenta;
  border-radius: 5px;
  font-size: 16px;
`
