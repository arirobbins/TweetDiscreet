/**
 * Created by arirobbins on 12/29/16.
 */
//State Object
var state = {
    API_KEY: "34d7e857bc1823e8c30763e59dfc71a0",
    MC_URL: "https://api.meaningcloud.com/sentiment-2.1",
    lang: "en",
    model: "general",
    results: ""
};

//Event Listeners
function apiCall(text){
    var settings = $.ajax({
        url: state.MC_URL,
        method: "POST",
        data: {
            key: state.API_KEY,
            lang: state.lang,
            txt: text,
            model: state.model
        },
        success: function(data){
            state.results = data;
            analyzeData(data);
        }
    });
}

function createTweetButton(){
    twttr.widgets.createShareButton(
        '/',
        document.getElementById('dialog'),
        {
            text: $(".tweet-area").val(),
            size: 'large'
        }
    );
}


function counter(){
    //This function handles the counter for the text box and sets
    //the color of the counter to red if the text length exceeds 140 characters
    $(".tweet-area").keyup(function(event){
       $("#count").text($(".tweet-area").val().length);

        if ($(".tweet-area").val().length > 140){
            $("span#count").addClass("red");
        }
        else {
            $("span#count").removeClass("red");
        }
    });
}

function analyzeData(data){
    var numSentences = data.sentence_list.length;
    var overallScore = "";
    var sentences = [];
    var tone = "";
    var element = "";

    data.sentence_list.map(function(val){
        switch(val.score_tag){
            case "P+":
                tone = "very positive!";
                break;
            case "P":
                tone = "positive.";
                break;
            case "NEU":
                tone = "neutral.";
                break;
            case "N":
                tone = "negative.";
                break;
            case "N+":
                tone = "very negative!";
                break;
            default:
                tone = "without sentiment...";
        }

    switch(data.score_tag){
        case "P+":
            overallScore = "very positive! You may want to consider if it's TOO positive, but otherwise you're safe to tweet!";
            break;
        case "P":
            overallScore = "positive. You should feel comfortable that it's safe to tweet.";
            break;
        case "NEU":
            overallScore = "neutral. You should feel comfortable that it's safe to tweet.";
            break;
        case "N":
            overallScore = "negative. You may want to reconsider before tweeting...";
            break;
        case "N+":
            overallScore = "very negative! There's a pretty good chance you will upset some people with this tweet...";
            break;
        default:
            overallScore = "without sentiment...I guess that means you should feel safe to tweet...";
    }

        sentences.push({text: val.text, confidence: val.confidence, score_tag: val.score_tag, "tone": tone});
    });

    element = "<p> Based on our analysis, we found " + numSentences + " sentence(s) in your tweet.</p>";

    for (var i = 0; i < numSentences; i++){
        element += "<p>In sentence " + (i+1) + ", '" + sentences[i].text + "', the tone is " + sentences[i].tone + "</p>";
    }

    element += "<p>The overall sentiment of your tweet is " + overallScore + "</p><p>We are " + data.confidence + "% confident of this analysis, it's up to you what to do next...</p>";

    $("#dialog").html(element);
    callDialog();
    // callDialogTest();
    // callPopup();
}

function callPopup(){
    $("#dialog").showPopup()
}

function callDialogTest(){
    if ($(window).width() < 1224){
        console.log("mobile");
    }
    else {
        console.log("desktop");
        $(".tweet-box").addClass("hidden");
        $(".button-counter").addClass("hidden");
        createTweetButton()
        $("#dialog").dialog({
            modal: true,
            width: 600,
            close: CloseFunction,
            overlay: {
                opacity: 0.5,
                background: "black"
            }
        });
    }
}

function callDialog(){
    $(".tweet-box").addClass("hidden");
    $(".button-counter").addClass("hidden");
    createTweetButton()
    $("#dialog").dialog({
        draggable: false,
        modal: true,
        width: 600,
        close: CloseFunction,
        overlay: {
            opacity: 0.5,
            background: "black"
        }
    });
}

function CloseFunction(){
    $(".tweet-box").removeClass("hidden");
    $(".button-counter").removeClass("hidden");
    //createTweetButton();
}

function main(){
    $("button#submit").on("click",function(event){
        event.preventDefault();
        //alert($(".tweet-area").val());
        apiCall($(".tweet-area").val());
        // createTweetButton();
    });

    $(".logo-click").on("click", function(event){
        $(".welcome").addClass("hidden");
        $(".tweet-box").fadeIn("slow", function(){
            // $(".tweet-box").removeClass("hidden");
            // $(".submit").removeClass("hidden");
        });
        $("h1").show("drop", {direction: "left"}, "slow");
    });
    counter();

}


$(document).ready(main);
