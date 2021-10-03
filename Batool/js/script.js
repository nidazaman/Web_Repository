// Toggle button using blur event in xs mode
$(function(){
    $("#navbarToggle").blur(function(event){
        var screenWidth = window.innerWidth;
        if (screenWidth<768){
            $("#collapsable-nav").collapse("hide");
        }
    });
    // In Firefox and Safari, the click event doesn't retain the focus
    // on the clicked button. Therefore, the blur event will not fire on
    // user clicking somewhere else in the page and the blur event handler
    // which is set up above will not be called.
    // Refer to issue #28 in the repo.
    // Solution: force focus on the element that the click event fired on
    $("#navbarToggle").click(function (event) {
        $(event.target).focus();
      });
});

//Dynamically insertion of Data starts here:
(function(global){
    var bt = {};
    var main_title_html = "snippets/index-title-snippet.html";
    var main_design_html = "snippets/index-designs snippet.html";
    var main_pg_json = "data/home_pg.json";
    var detail_html = "snippets/main_details_snippet.html"
    var dt_pg_url = "data/details.json";

    // function for inserting innerHTML
    var insertHtml = function(selector, html){
        var target = document.querySelector(selector);
        target.innerHTML = html;
    };
    // Show loading icon inside element identified by 'selector'.
    var showLoading = function(selector){
        var html = "<div class='text-center ajax-loader'>";
        html += "<img src='Images/ajax-loader.gif'  ></div>";
        insertHtml(selector,html);
    };
     // Return substitute of '{{propName}}'
     // with propValue in given 'string'
   var insertProperty = function (string, propName, propValue) {
       var propToReplace = "{{" + propName + "}}";
       string = string.replace(new RegExp(propToReplace, "g"), propValue);
       return string;
  }
    // Home Page till Main image
    document.addEventListener("DOMContentLoaded",function(event){
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            main_pg_json,
            function(main_pg_json){
                $ajaxUtils.sendGetRequest(
                    main_title_html,
                    function(main_title_html){
                        // Getting main_design_snippet
                        $ajaxUtils.sendGetRequest(
                            main_design_html,
                            function(main_design_html){
                                var final_home_html = buildHtml(main_pg_json,main_title_html,main_design_html);
                                insertHtml("#main-content",final_home_html);
                            },
                            false);
                },false);
        
            });
    });

    // using extracted files (json, title, design) nd converting 2 content
    function buildHtml(main_pg_json,main_title_html,main_design_html){
        var finalHtml = main_title_html;
        var sales_type = ["The Summer Sale","New Arrivals","Luxury Embroideries"]
        var value_arrays = [main_pg_json.TheSummerSale,main_pg_json.NewArrivals,main_pg_json.LuxuryEmb]
        for(var i=0; i<sales_type.length; i++){
            var extra_html = '<div '+'id="s'+i+'" class="section text-center"><!--Section div starts-->';
            finalHtml += extra_html;
            finalHtml += '<h1>'+sales_type[i]+'</h1>';
            finalHtml +='<div class="row"> <!--row div starts-->';
            my_list= value_arrays[i];
            
            for(var l=0; l< my_list.length; l++){
                var html = main_design_html;
                html = insertProperty(html,"imgPath",my_list[l].url);
                html = insertProperty(html,"shortName",my_list[l].short_name);
                html = insertProperty(html,"price",my_list[l].price);
            
                // Add clear after every second design in a section 
                if (l % 2 != 0) {
                  html +="<div class='clear visible-xs visible-sm'></div>";
                 }
                finalHtml += html;
            }
            finalHtml += '</div> <!--End Row div-->';
            finalHtml += '</div> <!--End Section div-->';
            
        }
        return finalHtml;
    }
    // Function for loading details page
    bt.loadDetails = function(design_short){
        showLoading("#main-content");

        $ajaxUtils.sendGetRequest(
            dt_pg_url,
            function (dt_pg_url){
                var json_data_fetched = dt_pg_url;
               
                $ajaxUtils.sendGetRequest(
                    detail_html,
                    function(detail_html){
                        var final_detail_html = buildDetailsHtml(json_data_fetched,detail_html,design_short);
                        console.log(final_detail_html);
                        insertHtml("#main-content", final_detail_html);
                    },
                    false
                );
            }
        );
    };

    function buildDetailsHtml(json_data_fetched,detail_html,design_short){
        var finalInsertion = '<a href="indx.html" id="Back_home"><span class="glyphicon glyphicon-home"></span> Home</a>';
        finalInsertion += '<h1 id="welcome" class="text-center">Welcome To Your Selection!</h1>';
        finalInsertion += '<div class="row"> <!--Row div starts-->';
        var my_array = json_data_fetched; //fetched data is an array
        for(var m=1; m< my_array.length; m++){
            if(design_short===my_array[m].short_name){
                extracted_details = my_array[m];
                break;
            }
        }
        var html2 = detail_html;
        html2 = insertProperty(html2,"imgUrl",extracted_details.imgUrl);
        html2 = insertProperty(html2,"name",extracted_details.name);
        html2 = insertProperty(html2,"code",extracted_details.code);
        html2 = insertProperty(html2,"price",extracted_details.price);
        html2 = insertProperty(html2,"aval",extracted_details.aval);
        html2 = insertProperty(html2,"color",extracted_details.color);
        html2 = insertProperty(html2,"fabric",extracted_details.fabric);
        html2 = insertProperty(html2,"size",extracted_details.size);
        html2 = insertProperty(html2,"type",extracted_details.type);
        html2 = insertProperty(html2,"des_1",extracted_details.des[0]);
        html2 = insertProperty(html2,"des_2",extracted_details.des[1]);
        html2 = insertProperty(html2,"des_3",extracted_details.des[2]);
        html2 = insertProperty(html2,"des_4",extracted_details.des[3]);
        html2 = insertProperty(html2,"des_5",extracted_details.des[4]);
        html2 = insertProperty(html2,"len_1",extracted_details.length[0]);
        html2 = insertProperty(html2,"len_2",extracted_details.length[1]);
        html2 = insertProperty(html2,"len_3",extracted_details.length[2]);
        html2 = insertProperty(html2,"len_4",extracted_details.length[3]);
        html2 = insertProperty(html2,"len_5",extracted_details.length[4]);
        finalInsertion += html2;
        finalInsertion += '</div> <!--row div ends-->';
        return finalInsertion;
    }
    global.$bt = bt;
})(window); //Dynamically insertion of Data ends here