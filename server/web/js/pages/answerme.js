setUpButtons(){
    $(".answer").click(function(){
       var data = {
           answer: $(this).data("answer"),
           userId: OP.getQueryVariable("userId")
       }
       OP.api(data, "submitAnswer", function(){
           $("#question").fadeOut(1000, function(){
               $("#response").fadeIn(1000);
           });
       });
   });
};

$(document).ready(function(){
    OP.apiGetData("getTodaysQuestion", function(question){
        $("#question-text").html(question.text);
        $(".answer")[0].data("questionid", question.answers[0].id);
        $(".answer")[1].data("questionid", question.answers[1].id);
        $(".answer")[2].data("questionid", question.answers[2].id);
        
        $(".answer-text")[0].html(question.answers[0].text);
        $(".answer-text")[1].html(question.answers[1].text);
        $(".answer-text")[2].html(question.answers[2].text);
        setUpButtons();
    });
});