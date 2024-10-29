import logo from './logo.svg';
import './App.css';
import { useQuery, gql } from '@apollo/client'

function App() {
  const query = gql`
    query GetTodosWithUser {
      getTodos {
        title
        completed
        user {
          email
          name
          phone
        }
      }
    }
  `
  const { data, loading } = useQuery(query)

  if (loading) return <h1>Loading...</h1>

  return (
    <div className="App">
      <table style={{"textAlign": "left"}}>
        <thead>
          <tr>
            <th>ToDo</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {
            data.getTodos.map((x) => (
              <tr key={x.id}>
                <td>{x.title}</td>
                <td>{x.user.name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
