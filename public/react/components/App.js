import React, { useState, useEffect } from 'react';
import { PagesList } from './PagesList';

// import and prepend the api url to any fetch calls
import apiURL from '../api';

export const App = () => {

  const [pages, setPages] = useState([]);
  const [articleData, setArticleData] = useState(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false);

  async function fetchPage(slug){
    try {
      const response = await fetch(`${apiURL}/wiki/${slug}`);
      const pageData = await response.json();
      return pageData;
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  }

  async function fetchPages(){
    try {
      const response = await fetch(`${apiURL}/wiki`);
      const pagesData = await response.json();
      setPages(pagesData);
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  }

  useEffect(() => {
    fetchPages();
  }, []);

  async function handlePageClick(slug) {
    const pageData = await fetchPage(slug);
    setArticleData(pageData);
  }

  function handleBackToListClick() {
    setArticleData(null);
  }

  function handleAddArticleClick() {
    setIsAddingArticle(true);
  }

  async function handleSubmitArticle(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const articleData = {
      title: formData.get('title'),
      content: formData.get('content'),
      name: formData.get('name'),
      email: formData.get('email'),
      tags: formData.get('tags')
    };
    const response = await fetch(`${apiURL}/wiki`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(articleData)
    });
    const responseData = await response.json();
    setIsAddingArticle(false);
    setArticleData(null);
    fetchPages();

	async function handleDeletePage() {
		try {
		  await fetch(`${apiURL}/wiki/${articleData.slug}`, {
			method: 'DELETE',
		  });
		  setArticleData(null);
		  fetchPages();
		} catch (err) {
		  console.log("Oh no an error! ", err);
		}
	  }
	  
  }

  return (
    <main>  
      <h1>WikiVerse</h1>
      <h2>An interesting 📚</h2>
      {isAddingArticle ? (
        <form onSubmit={handleSubmitArticle}>
          <label>
            Title:
            <input type="text" name="title" required />
          </label>
          <br />
          <label>
            Content:
            <textarea name="content" required />
          </label>
          <br />
          <label>
            Name:
            <input type="text" name="name" required />
          </label>
          <br />
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <br />
          <label>
            Tags:
            <input type="text" name="tags" />
          </label>
          <br />
          <button type="submit">Add Article</button>
        </form>
      ) : articleData ? (
        <div>
          <h3>{articleData.title}</h3>
          <p>{articleData.content}</p>
          <button onClick={handleBackToListClick}>Back to Wiki List</button>
		  <button onClick={handleDeletePage}>Delete Article</button>
        </div>
      ) : (
        <>
          <button onClick={handleAddArticleClick}>Add Article</button>
          <PagesList pages={pages} onPageClick={handlePageClick} />

        </>
      )}
    </main>
  );
};
