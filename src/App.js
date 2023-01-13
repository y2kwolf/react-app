import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Footer from './pages/Footer';

// Components
function Header(props){
  // console.log('props', props, props.title);
  return <header>
    <h1><a href="/" onClick={event=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

function Nav(props){
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder="body" rows="10" cols="50"></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}

function Article(props){
  return <article>
    <h2>{props.title}</h2>
    <pre>{props.body}</pre>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} rows="10" cols="50" onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}

function App() {
  // const _mode = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  const [mode, setMode] = useState('WELCOME'); // mode, setMode 사용자명 가능
  const [id, setId] = useState(null);

  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'HTML', body:'HTML is the standard markup language for Web pages. With HTML you can create your own Website.'},
    {id:2, title:'CSS', body:'CSS is the language we use to style an HTML document. CSS describes how HTML elements should be displayed.'},
    {id:3, title:'JavaScript', body:'JavaScript is the worlds most popular programming language. JavaScript is the programming language of the Web.'}
  ]);

  let content = null;
  let contextControl = null;

  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      // console.log(topics[i].id, id)
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a href={'/update'+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={()=>{
        const newTopics = [];
        for(let i=0; i<topics.length; i++){
          if(topics[i].id != id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME')
      }} /></li>
    </>
  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      // console.log(topics[i].id, id)
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  // HTML문법이 아닌 JSX 문법 ex) className는 HTML의 class임
  return (
    <div className="App">
      <Header title="React Website" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);
      }}></Nav>
      <hr></hr>
      {content}
      <hr></hr>
      <ul>
        <li>
          <a href="/create" onClick={event=>{
            event.preventDefault();
            setMode('CREATE')
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
      <Footer />
    </div>
  );  
}

export default App;