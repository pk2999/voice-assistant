import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';

import logo from './image/logo.png';
import alan from './image/alan.jpg';
import { NewsCards, Modal } from './components';
import useStyles from './styles';

// const alanKey='b9a1beca0a2c16cdba40fd8c3b6d0d392e956eca572e1d8b807a3e2338fdd0dc/stage'

const App = () => {
  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    alanBtn({
       key: 'b9a1beca0a2c16cdba40fd8c3b6d0d392e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'instructions') {
          setIsOpen(true);
        } else if (command === 'highlight') {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === 'open') {
          const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > articles.length) {
            alanBtn().playText('Please try that again...');
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');
          }
        }
      },
    });
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br/><br/>Open article number [4]</Typography></div>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br/><br/>Go back</Typography></div>
          </div>
        ) : null}
        <img src={alan} className={classes.alanLogo} alt="alan logo" />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
            Created by
            {/* <a className={classes.link} href="https://www.linkedin.com/in/adrian-hajdin/"> Adrian Hajdin</a> - */}
            <a className={classes.link} href="http://instagram.com">PK Mastery</a>
          </Typography>
          <img className={classes.image} src={logo} height="50px" alt="PK logo" />
        </div>
      ) : null}
    </div>
  );
};

export default App;


