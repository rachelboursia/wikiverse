import React, { useState, useEffect } from 'react';
import { PagesList } from './PagesList';

// import and prepend the api url to any fetch calls
import apiURL from '../api';

export const App = () => {

	const [pages, setPages] = useState([]);
	const [selectedArticle, setSelectedArticle] = useState(null);

	async function fetchPages(slug = null){
		try {
			const url = slug ? `${apiURL}/wiki/${slug}` : `${apiURL}/wiki`;
			const response = await fetch(url);
			const pagesData = await response.json();
			if (slug) {
				setSelectedArticle(pagesData);
			} else {
			setPages(pagesData);
			}
		} catch (err) {
			console.log("Oh no an error! ", err)
		}
	}

	useEffect(() => {
		fetchPages();
	}, []);

	const ArticleDetails = ({article, onBackClick}) => {
		return (
			<>
				<h3>{article.title}</h3>
				<p>{article.content}</p>
				<button onClick={onBackClick}>Back to Wiki List</button>
			</>
		);
	}

	return (
		<main>	
      <h1>WikiVerse</h1>
		{selectedArticle ? (
			<ArticleDetails
				article={selectedArticle}
				onBackClick={() => setSelectedArticle(null)}
				/>
		) : (
			<PagesList 
				pages={pages}		
			 	onArticleClick={(slug) => fetchPages(slug)} 
			/>
		)}
		</main>
	)
}