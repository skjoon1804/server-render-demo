import React from 'react';
import express from 'express';
import {renderToString} from 'react-dom/server';

import {readFileSync} from 'fs';
import {App} from '../client/App';
import {handleModifyAnswerVotes} from '../shared/utility';

const data = {
    questions: [{
        questionId: "Q1",
        content: "Should we use JQuery or Fetch for Ajax?"
    },
    {
        questionId: "Q2",
        content: "What is the best feature of React?"
    }],
    answers: [{
        answerId: "A1",
        questionId: "Q1",
        upvotes: 2,
        content: "JQuery"
    },
    {
        answerId: "A2",
        questionId: "Q1",
        upvotes: 1,
        content: "Fetch"
    },
    {
        answerId: "A3",
        questionId: "Q2",
        upvotes: 1,
        content: "Performance"
    }]
}


const app = new express();
app.use(express.static("dist"));    // in dist directory will serve as a static file to demonstrate

app.get("/vote/:answerId", (req, res) => {
    const {query, params} = req;
    data.answers = handleModifyAnswerVotes(data.answers, params.answerId, +query.increment);
    res.send("OK");
})

app.get("/data", async(req, res) => {
    res.json(data);
})

app.get('/', async (req, res) => {
    const index = readFileSync(`public/index.html`, `utf8`);
    const rendered = renderToString(<App {...data} />);
    res.send(index.replace("{{rendered}}", rendered));
    
});

app.listen(7777);
console.log("Server is listening");