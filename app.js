import React from "react";
import ReactDOM from "react-dom";
import Styled from "styled-components";
import 'babel-polyfill';

let MainCont = Styled.div `width:80%;margin:auto;`;

function Header(props){
    let Header = Styled.div ` width:100%;display:flex;justify-content:space-between;align-items:center; `;
    let Logo   = Styled.img `width:200px;padding:50px;`;
    let SearchBox = Styled.div `position:relative;`;
    let SearchImg = Styled.img `position:absolute;width:20px;padding:9px;`;
    let SearchInput = Styled.input `background-color:#000;border-radius:20px;width:300px;font-size:24px;padding:6px 20px;color:#747779;border:0px;padding:4px 10px 4px 35px;outline:none;`;
    return (
        <Header>
            <div>
                <Logo src={require('./assets/logo.png')} alt="fikracamps logo" />
            </div>
            <SearchBox>
                <SearchImg src={require('./assets/searchlogo.png')} alt="search logo" />
                <SearchInput type="search" placeholder="search a topic" id="search" autoComplete="off" onKeyUp={props.onKeyEnterFun}/>
            </SearchBox>
        </Header>
    )
}

function Articale(props){
    let Articales = Styled.div `display:flex;`;
    let RecentLinks = Styled.div `flex-grow:2;flex-basis:1200px;`;
    return (
        <Articales>
            <RecentLinks>
                <span>Recent Links</span>
                <hr />
                <br />
                <main id="news">
                    {props.news}
                </main>  
            </RecentLinks>  
        </Articales>
    )
}

function NewData(props){
    let ArticaleDiv = Styled.article `display:flex;margin-bottom:20px;position:relative;box-shadow:1px 1px 20px rgba(0,0,0,0.2);border-radius:5px;padding:10px;`;
    let ImgCont = Styled.div `display:flex;flex-basis:150px;`;
    let NewImg = Styled.img `height:150px;width:150px;`;
    let TextCont = Styled.div `position:relative;padding-left:20px;padding-right:80px;`;
    let Texttitle = Styled.span `text-transform:capitalize;font-weight:bolder;display:block;font-family: 'Libre Baskerville', serif;font-size:24px;padding:0px 4px 0px 0px;`;
    let TextSpan  = Styled.span `display:block;color:silver;padding:0px 10px 0px 20px;font-family: 'Source Sans Pro', sans-serif;font-size:18px;padding-bottom:40px;`;
    let TextTime = Styled.time `position:absolute;bottom:0px;color:blue;font-family: 'Source Sans Pro', sans-serif;`;
    let VoteCont = Styled.div `position:absolute;text-align:center;right:0px;padding-right:20px;`;
    let VoteUp = Styled.img `cursor:pointer;width:30px;height:30px;`;
    let VoteSpan = Styled.span `font-size:30px;font-weight:bolder;`;
    let VoteDown = Styled.img `cursor:pointer;width:30px;height:30px;`;
    return (
        <ArticaleDiv>
            <ImgCont>
                <NewImg src={props.urlToImage} alt="news picture" />
            </ImgCont>
            <TextCont>
                <Texttitle id={'title'+props.id}>{props.title}</Texttitle>
                <TextSpan>{props.description}</TextSpan>
                <TextTime id={"time"+props.id} dateTime={props.publishedAt}>{props.publishedAt}</TextTime>
            </TextCont>
            <VoteCont>
                <VoteUp src={require('./assets/upvote.png')} id={"upvote" + props.id} onClick={props.votingFun}/>
                <br />
                <VoteSpan id={"votenum"+props.id}>{props.voutenum}</VoteSpan>
                <br />
                <VoteDown src={require('./assets/downvote.png')} id={"dnvote" + props.id} onClick={props.votingFun}/>
            </VoteCont>
        </ArticaleDiv>
    )
}

class NewsApp extends React.Component {
    constructor (){
        super()
        this.state = {
            newsData : [],
            newsTarget : 'iraq'
        };
        this.getNews();
        
    }

    getNews(Target = 'iraq'){
        let date = new Date();
        fetch(`https://newsapi.org/v2/everything?q=${Target}&from=${date.getFullYear()}-${date.getMonth()}-${date.getDate()}&sortBy=publishedAt&apiKey=b60f15202abc40cf895fd1162f96752b`)
        .then((response)=>{ return response.json(); })
        .then((data)=>{
            this.setState({
                newsData: data.articles
            })
        })
    }

    FeedNews() {
        if (this.state.newsData.length != 0){
            return (
                this.state.newsData.map((_new_, i)=>{
                    // localStorage key equal to author + publishedAt of article and it value equel to vote number
                    // check if we set item for this articale previously, if not set item for it
                    var key = _new_.title + _new_.publishedAt;
                    if(localStorage.getItem(key) == undefined || localStorage.getItem(key) == null || localStorage.getItem(key) == NaN){
                        localStorage.setItem(key,"0");
                    }
                    return <NewData  urlToImage = {_new_.urlToImage} id={i} title={_new_.title} description={_new_.description} publishedAt={_new_.publishedAt} voutenum={localStorage.getItem(key)} key={i} votingFun={this.voting.bind(this)} />
                })
            )
        }
    }

    voting(event){
        let tagID       = event.target.id;
        let vote_id 	= tagID.substring(6); //get articale id
        let alt			= tagID.substring(0,6); //get action is upvote or downvote
        let title_art	= document.getElementById('title'+vote_id).innerHTML; //get articale title
        let time_art	= document.getElementById('time'+vote_id).innerHTML; //get artical time
        let vote_tag	= document.getElementById('votenum'+vote_id); //define vote number 'span' tag
        let _Key_		= title_art + time_art; //set key of localStorage
        let votenum		= 0; //set defualt value for vote number
        //check we have db for this artical. if no have make noe for it
        if(localStorage.getItem(_Key_) != undefined && localStorage.getItem(_Key_) != null && localStorage.getItem(_Key_) != NaN){
            votenum = parseInt(localStorage.getItem(_Key_));
        }
        //check action is upvote or downvote for increasing or decreasing vote number
        if(alt == 'upvote'){ votenum++; }
        if(alt == 'dnvote'){ votenum--; }
        //update db for this articale 'vote number'
        localStorage.setItem(_Key_,votenum); 
        //append new value of vote number for vote_tag of target articale
        vote_tag.innerHTML = votenum;
    }
    
    onPressEnter(event){
        if (event.keyCode == 13){ 
            let _target_ = document.getElementById('search');
            let _targetVal_ = _target_.value;
            if (_targetVal_.length == 0){ _targetVal_ = "luffy" }
            this.getNews(_targetVal_);
            this.setState({
                newsTarget : _targetVal_
            })
         }
    }

    render(){
        return (
            <MainCont>
                <Header onKeyEnterFun={this.onPressEnter.bind(this)} />
                <Articale news={this.FeedNews()}/>
            </MainCont>
        )
    }
}

ReactDOM.render(
    <NewsApp />,
    document.getElementById('root')
);