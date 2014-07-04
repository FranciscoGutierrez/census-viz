/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 CensusViz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* Global Network View Component.
 * This component searches through Neo4j Server Database.
 * This component uses Neo4j RESTful API
 * Universidad de las Américas Puebla http://ict.udlap.mx
 * As part of REAUMOBILE project.
 * Author: Francisco Gutiérrez (fsalvador23@gmail.com)
 */

jQuery(function () {
    /*
     * Ask for JQuery, it must be called first.
     */
    if ('registerElement' in document) {
        /* Supported Cheer up!*/
        document.registerElement('network-view', {
            prototype: Object.create(HTMLElement.prototype)
        }); {}
        $("network-view").append("<div class='nv-container'></div>");
        $(".nv-container").append("<div class='nv-options'></div>");
        var neo4jURL = $("network-view").attr("neo4j");
    } else {
        /* Not supported what do I do?*/
        $(".nv-container").append("<div class='nv-options'></div>");
    }
    /*
     * Set up the visualization, appending all elementents "nv" stands for "network view".
     * Append centralities option box.
     */
    $(".nv-options").append("<div class='nv-opt-title'>Opciones de Búsqueda</div>");
    $(".nv-options").append("<div class='nv-opt-centralities'><span>Personas</span></div>");
    $(".nv-opt-centralities").append("<div class='nv-opt-box-centralities-selected'>Todas</div>");
    $(".nv-opt-centralities").append("<div class='nv-opt-box-centralities'>Lideres</div>");
    $(".nv-opt-centralities").append("<div class='nv-opt-box-centralities'>Clave</div>");
    $(".nv-opt-centralities").append("<div class='nv-opt-box-centralities'>Alejadas</div>");
    $(".nv-opt-centralities").append("<div class='nv-opt-box-centralities'>Similares</div>");
    /*
     * Append the "gender" option box.
     */
    $(".nv-options").append("<div class='nv-opt-gender'><span>Género</span></div>");
    $(".nv-opt-gender").append("<div class='nv-opt-box-gender-selected'>Todas</div>");
    $(".nv-opt-gender").append("<div class='nv-opt-box-gender'>Hombres</div>");
    $(".nv-opt-gender").append("<div class='nv-opt-box-gender'>Mujeres</div>");
    /*
     * Append the "age" option box.
     */
    $(".nv-options").append("<div class='nv-opt-age'><span>Edad</span></div>");
    $(".nv-opt-age").append("<div class='nv-opt-box-age-selected'>Todas</div>");
    $(".nv-opt-age").append("<div class='nv-opt-box-age'>Mayor de</div>");
    $(".nv-opt-age").append("<div class='nv-opt-box-age'>Menor de</div>");
    $(".nv-opt-age").append("<input type='text' name='search' autocomplete='off'/>Años");
    /*
     * Append the "city" search-box.
     */
    $(".nv-options").append("<div class='nv-opt-city'><span>Ciudad de Origen</span></div>");
    $(".nv-opt-city").append("<div class='nv-opt-box-city'><input type='text' name='search' autocomplete='off'/></div>");
    /*
     * Append the "profession" search-box.
     */
    $(".nv-options").append("<div class='nv-opt-profession'><span>Profesión</span></div>");
    $(".nv-opt-profession").append("<div class='nv-opt-box-profession'><input type='text'name='search'autocomplete='off'/></div>");
    /*
     * Append the "terms and pois" search-box.
     */
    $(".nv-options").append("<div class='nv-search'><span>Términos y Puntos de interés</span></div>");
    $(".nv-search").append("<input type='text' name='search' autocomplete='off'/>");
    $(".nv-container").append("<div class='nv-graphic'></div>");
    $(".nv-container").append("<div class='nv-tag-pool'></div>");
    $(".nv-tag-pool").append("<h1 class='nv-pool-title'>Búsquedas Filtradas</h1>");
    $(".nv-container").append("<div class='nv-toolbar'></div>");
    $(".nv-container").append("<div class='nv-people'></div>");
    $(".nv-people").append("<h1 class='nv-people-title'>Personas</h1>");

    $(".nv-container").append("<div class='nv-sigma-container'></div>");

    /*
     * Event Handler for the nv-search input.
     */
    $(".nv-search").on("input", function () {
        if ($(".nv-search-box").length < 1) {
            $(".nv-search").append("<div class='nv-search-box'></div>");
            $(".nv-search-box").css("margin-top", "0px");
        }
        var txtvalue = $(".nv-search > input").val();
        var rowClass = "<div class='nv-sb-row'>";
        var elementClass = "<div class='nv-sb-element'>";
        var termClass = "<div class='nv-sb-term'>";
        getAttributes(txtvalue, function (callback) {
            $(".nv-search-box").empty();
            for (var index = 0; index < callback.length; index++) {
                $(".nv-search-box").append(rowClass + elementClass + callback[index][0] +
                    "</div>" + termClass + ":" + callback[index][1] + "</div></div>");
            }
        });
    });
    $(".nv-opt-box-city").on("input", function () {
        if ($(".nv-opt-box-city").length <= 1) {
            $(".nv-opt-box-city").append("<div class='nv-search-box'></div>");
            $(".nv-search-box").css("margin-top", "0px");
            $(".nv-search-box").css("width", "95px");
            $(".nv-search-box").css("font-size", "14px");
            $(".nv-search-box").css("padding", "4px");
        }
        var txtvalue = $(".nv-opt-box-city > input").val();
        var rowClass = "<div class='nv-sb-row'>";
        var elementClass = "<div class='nv-sb-element'>";
        getCity(txtvalue, function (callback) {
            $(".nv-search-box").empty();
            for (var index = 0; index < callback.length; index++) {
                $(".nv-search-box").append(rowClass + elementClass + callback[index][0] +
                    "</div></div>");
                $(".nv-sb-element").css("border-radius", "3px");
            }
        });
    });
    $(".nv-opt-box-profession").on("input", function () {
        if ($(".nv-opt-box-profession").length <= 1) {
            $(".nv-opt-box-profession").append("<div class='nv-search-box'></div>");
            $(".nv-search-box").css("margin-top", "0px");
            $(".nv-search-box").css("width", "140px");
            $(".nv-search-box").css("font-size", "14px");
            $(".nv-search-box").css("padding", "4px");
        }
        var txtvalue = $(".nv-opt-box-profession > input").val();
        var rowClass = "<div class='nv-sb-row'>";
        var elementClass = "<div class='nv-sb-element'>";
        getProfession(txtvalue, function (callback) {
            $(".nv-search-box").empty();
            for (var index = 0; index < callback.length; index++) {
                $(".nv-search-box").append(rowClass + elementClass + callback[index][0] +
                    "</div></div>");
                $(".nv-sb-element").css("border-radius", "3px");
            }
        });
    });
    $(".nv-container").on('mouseenter', '.nv-sb-row', function () {
        $(this).find(".nv-sb-element").css("text-decoration", "underline");
        var parent = $(this).parent().parent().attr('class');
        if (parent == "nv-opt-box-city") {
            $(this).find(".nv-sb-element").css("background", "#aad1d8");
        } else if (parent == "nv-opt-box-profession") {
            $(this).find(".nv-sb-element").css("background", "#5a6ccc");
        } else {
            $(this).find(".nv-sb-element").css("background", "#A9071E");
        }
        $(this).find(".nv-sb-element").css("color", "#fff");
        $(this).find(".nv-sb-term").css("color", "#fafafa");
        if ($(this).find(".nv-sb-term").text() == ":Poi") {
            $(this).find(".nv-sb-term").css("background", "#A0D36E");
        } else {
            $(this).find(".nv-sb-term").css("background", "#FACB47");
        }
    });

    $(".nv-container").on('mouseleave', '.nv-sb-row', function () {
        $(this).find(".nv-sb-element").css("text-decoration", "none");
        $(this).find(".nv-sb-element").css("background", "none");
        $(this).find(".nv-sb-element").css("color", "black");
        $(this).find(".nv-sb-term").css("color", "gray");
        $(this).find(".nv-sb-term").css("background", "none");
        $(this).find(".nv-sb-term").css("text-decoration", "none");
    });

    $(".nv-container").on('click', '.nv-sb-row', function () {
        var elementVal = $(this).find(".nv-sb-element").text();
        var termVal = $(this).find(".nv-sb-term").text().substring(1);
        var parent = $(this).parent().parent().attr('class');
        if (parent == "nv-opt-box-city") {
            termVal = "city";
        } else if (parent == "nv-opt-box-profession") {
            termVal = "profession";
        }
        var termBack = $(this).find(".nv-sb-term").css("background");
        $(".nv-search > input").val('');
        $(".nv-tag-pool").append("<div class='nv-tag-" + termVal + "'><span>" + elementVal + "</span></div>");
        if (termVal == "Term") {
            $(".nv-tag-Term").css("background", termBack);
        } else if (termVal == "Poi") {
            $(".nv-tag-Poi").css("background", termBack);
        } else if (termVal == "city") {
            $(".nv-tag-city").css("background", "#aad1d8");
        } else if (termVal == "profession") {
            $(".nv-tag-profession").css("background", "#6e85d3");
        }
    });

    $(".nv-search > input").on("focusout", function () {
        $(this).val("");
        window.setTimeout(function () {
            $(".nv-search-box").remove();
        }, 150);

    });
    $(".nv-opt-box-city > input").on("focusout", function () {
        $(this).val("");
        window.setTimeout(function () {
            $(".nv-search-box").remove();
        }, 150);
    });
    $(".nv-opt-box-profession > input").on("focusout", function () {
        $(this).val("");
        window.setTimeout(function () {
            $(".nv-search-box").remove();
        }, 150);
    });
    /*
     * Remove the tags from the tag-pool when clicked.
     * Update the chart.
     */
    $(".nv-tag-pool").on('click', 'div', function () {
        $(this).remove();
    });

    $(".nv-container").on('mouseenter', '.nv-tag-Term', function () {
        $(this).find("span").css("visibility", "hidden");
        $(this).append("<div class='nv-close-tag'>x</div>");
        $(this).find(".nv-close-tag").css("position", "relative");
        $(this).find(".nv-close-tag").css("margin-left", "40%");
        $(this).find(".nv-close-tag").css("margin-top", "-16px");
        $(this).css("background", "#e1705d");
        $(this).css("cursor", "pointer");
    });

    $(".nv-container").on('mouseleave', '.nv-tag-Term', function () {
        $(this).find("span").css("visibility", "visible");
        $(this).find(".nv-close-tag").remove();
        $(this).css("background", "#f9c32a");
    });

    $(".nv-container").on('mouseenter', '.nv-tag-Poi', function () {
        $(this).find("span").css("visibility", "hidden");
        $(this).append("<div class='nv-close-tag'>x</div>");
        $(this).find(".nv-close-tag").css("position", "relative");
        $(this).find(".nv-close-tag").css("margin-left", "40%");
        $(this).find(".nv-close-tag").css("margin-top", "-16px");
        $(this).css("background", "#e1705d");
        $(this).css("cursor", "pointer");
    });

    $(".nv-container").on('mouseleave', '.nv-tag-Poi', function () {
        $(this).find("span").css("visibility", "visible");
        $(this).find(".nv-close-tag").remove();
        $(this).css("background", "#8fcf56");
    });

    $(".nv-container").on('mouseenter', '.nv-tag-city', function () {
        $(this).find("span").css("visibility", "hidden");
        $(this).append("<div class='nv-close-tag'>x</div>");
        $(this).find(".nv-close-tag").css("position", "relative");
        $(this).find(".nv-close-tag").css("margin-left", "40%");
        $(this).find(".nv-close-tag").css("margin-top", "-16px");
        $(this).css("background", "#e1705d");
        $(this).css("cursor", "pointer");
    });

    $(".nv-container").on('mouseleave', '.nv-tag-city', function () {
        $(this).find("span").css("visibility", "visible");
        $(this).find(".nv-close-tag").remove();
        $(this).css("background", "#aad1d8");
    });

    $(".nv-container").on('mouseenter', '.nv-tag-profession', function () {
        $(this).find("span").css("visibility", "hidden");
        $(this).append("<div class='nv-close-tag'>x</div>");
        $(this).find(".nv-close-tag").css("position", "relative");
        $(this).find(".nv-close-tag").css("margin-left", "40%");
        $(this).find(".nv-close-tag").css("margin-top", "-16px");
        $(this).css("background", "#e1705d");
        $(this).css("cursor", "pointer");
    });

    $(".nv-container").on('mouseleave', '.nv-tag-profession', function () {
        $(this).find("span").css("visibility", "visible");
        $(this).find(".nv-close-tag").remove();
        $(this).css("background", "#5a6ccc");
    });
    /* Events on Click Options Box
     *
     */
    $(".nv-container").on('click', '.nv-opt-box-centralities', function () {
        $(".nv-graphic").empty();
        $(".nv-sigma-container").empty();
        $(".nv-sigma-container").append("<div id='graph-container-title'>Network").append("<div id='graph-container'></div></div>");
        $(".nv-graphic").addClass("animated fadeInLeftBig");
        $(".nv-people").empty();
        $(".nv-people").append("<h1 class='nv-people-title'>Personas</h1>");
        switch ($(this).html()) {
            case "Todas":
				setPieChartFor("all");
		        setUpPeopleDataAreFor("all");
                break;
            case "Lideres":
				setPieChartFor("leaders");
		        setUpPeopleDataAreFor("leaders");
                break;
            case "Clave":
				setPieChartFor("key");
		        setUpPeopleDataAreFor("key");
                break;
            case "Alejadas":
				setPieChartFor("far");
		        setUpPeopleDataAreFor("far");
                break;
            case "Similares":
				setPieChartFor("similar");
		        setUpPeopleDataAreFor("similar");
                break;
        }
        $(".nv-people").css("visibility", "visible");
        $(".nv-sigma-container").css("visibility", "visible");
        $(".nv-sigma-container").addClass("animated fadeIn");
        $(".nv-people").addClass("animated fadeIn");
        var peopleBoxTitle = $(this).html();
        if (peopleBoxTitle == "Todas") peopleBoxTitle = "";
        $(".nv-people-title").html("Personas " + peopleBoxTitle);
        
        $("#graph-container").empty();
        $(function () {
            setTimeout(function () {
				launchSigmaViz();
                $(".nv-sigma-container").removeClass("animated fadeIn");
                $(".nv-graphic").removeClass("animated fadeInLeftBig");
                $(".nv-people").removeClass("animated fadeIn");
            }, 1000);
        });
        var selected = $(".nv-opt-box-centralities-selected").removeClass();
        selected.addClass("nv-opt-box-centralities");
        $(this).removeClass();
        $(this).addClass("nv-opt-box-centralities-selected");

    });
    $(".nv-container").on('click', '.nv-opt-box-gender', function () {
        var selected = $(".nv-opt-box-gender-selected").removeClass();
        selected.addClass("nv-opt-box-gender");
        $(this).removeClass();
        $(this).addClass("nv-opt-box-gender-selected");
    });
    $(".nv-container").on('click', '.nv-opt-box-age', function () {
        var selected = $(".nv-opt-box-age-selected").removeClass();
        selected.addClass("nv-opt-box-age");
        $(this).removeClass();
        $(this).addClass("nv-opt-box-age-selected");
    });
    /***** Pie Chart Visualization *********/
    function setPieChartFor(persons) {
        getCountOf(persons, "", function (data) {
            data = [{
                "pesona": "Amigos Interesantes",
                    "population": data[0][0]
            }];
            var width = 300,
                height = 300,
                radius = Math.min(width, height) / 2;

            var color = d3.scale.ordinal()
                .range(["#d0ec75", "#f591a3", "#77d3e6", "#6e85d3", "#aad1d8"]);

            var arc = d3.svg.arc()
                .outerRadius(radius - 30);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                return d.population;
            });

            var svg = d3.select(".nv-graphic").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2.5 + ")");

            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");
            g.append("path")
                .attr("d", arc)
                .attr("class", "path")
                .style("fill", function (d) {
                return color(d.data.metric);

            });
            g.append("text")
                .attr("class", "label")
                .attr("transform", function (d) {
                var dist = radius - 20;
                angle = (d.startAngle + d.endAngle) / 2; // Middle of wedge
                x = 1.28; //dist * Math.sin(angle); //Around the pie.
                y = 175; //-dist * Math.cos(angle); //Around the pie.
                return "translate(" + x + "," + y + ")";
            })
                .attr("dy", "0.55em")
                .attr("text-anchor", "middle")
                .text(function (d) {
                //return d.data.metric;
            });
            g.append("text")
                .attr("class", "label-meta")
                .attr("transform", function (d) {
                var dist = radius - 20;
                angle = (d.startAngle + d.endAngle) / 2;
                x = 1.28; //dist * Math.sin(angle); //Turn me on to around the pie.
                y = 130; //-dist * Math.cos(angle); //Turn me on to around the pie.
                return "translate(" + x + "," + y + ")";
            })
                .attr("dy", "1.75em")
                .attr("text-anchor", "middle")
                .text(function (d) {
                var personas = $(".nv-opt-box-centralities-selected").html();
                if (personas == "Todas") {
                    personas = "";
                }
                return d.data.population.toLocaleString() + " Personas " + personas;
            });
            /*
             * Event handler:
             */
            $("path").mouseenter(function () {
                var color = $(this).css("fill");
                $(".nv-graphic").addClass("animated pulse");
                //$(this).next().css("visibility", "visible");
                $(this).next().next().css("visibility", "visible");
                $(this).next().fadeIn(200);
                $(this).next().next().fadeIn(200);
                color = color.replace(/[^0-9,]+/g, "");
                var red = color.split(",")[0];
                var gre = color.split(",")[1];
                var blu = color.split(",")[2];
                $(this).css("fill", Lighthen(red, gre, blu, 0.85));
                $(this).css("cursor", "pointer");
            });
            /*
             * Event handler:
             */
            $("path").mouseleave(function () {
                var color = $(this).css("fill");
                $(".nv-graphic").removeClass("animated pulse");
                // $(this).next().fadeOut(200);
                // $(this).next().next().fadeOut(200);
                color = color.replace(/[^0-9,]+/g, "");
                var red = color.split(",")[0];
                var gre = color.split(",")[1];
                var blu = color.split(",")[2];
                $(this).css("fill", Darken(red, gre, blu, 0.85));
                $(this).css("fill-opacity", "1");
            });
            /*
             * On click over Pie Chart Section, load persons.
             */
            $("path").click(function () {
                $(".nv-container").append("<div class='nv-user-list'></div>");
                $(".nv-user-list").append("<div class='nv-user-box'></div>");
                $(".nv-user-box").append("<div class='nv-ubox-id'></div>");
                $(".nv-user-box").append("<div class='nv-ubox-img'></div>");
                $(".nv-user-box").append("<div class='nv-ubox-name'></div>");
                $(".nv-user-box").append("<div class='nv-ubox-meta'></div>");
                $(".nv-user-box").append("<div class='nv-ubox-act1'></div>");
                $(".nv-user-box").append("<div class='nv-ubox-act2'></div>");
            });
        }, function (data) {
            console.log(data);
            /** Visuazation of users, activate on click. **/
        });
    }

    /***** Pie Chart Visualization (Ends Here) *********/

    /*
     * Ajax Requests Using jQuery
     * 
     */
    function getCountOf(people, serverURL, countCallback, usersCallback) {
        var query = "MATCH (n:Profile) return count(n)";
        switch (people) {
            case "all":
                query = "MATCH (n:Profile) return count(n)";
                break;
            case "leaders":
                query = "MATCH (n:Profile) WHERE n.closeness<=2 return count(n)";
                break;
            case "key":
                query = "MATCH (n:Profile) return count(n)";
                break;
            case "far":
                query = "MATCH (n:Profile) WHERE n.closeness>=2 return count(n)";
                break;
            case "similar":
                query = "MATCH (n:Profile) return count(n)";
                break;
        }
        var countRequest = $.ajax({
            type: "POST",
            url: neo4jURL + "/db/data/cypher",
            dataType: 'json',
            data: {
                "query": query
            },
            headers: {
                "Authorization": "Basic " + btoa("spribo2:6e0mtjm8OEgoSRpjNhii")
            },
            success: function (data, textStatus, jqXHR) {
                countCallback(data.data);
                //console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //console.log(jqXHR);
            }
        });
    }

    function setUpPeopleDataAreFor(people) {
        var items = [];
        switch (people) {
            case "all":
                getUsersOf("all", function (data) {
                    showDataset(data);
                });
                break;
            case "leaders":
                getUsersOf("leaders", function (data) {
                    showDataset(data);
                });
                break;
            case "key":
                getUsersOf("key", function (data) {
                    showDataset(data);
                });
                break;
            case "far":
                getUsersOf("far", function (data) {
                    showDataset(data);
                });
                break;
            case "similar":
                getUsersOf("similar", function (data) {
                    showDataset(data);
                });
                break;
        }

        function showDataset(dataset) {
            for (var i = 0; i < dataset.length; i++) {
                background = "url(http://placehold.it/90x90) no-repeat center center";
                items.push("<div class='nv-person-box'>");
                items.push("<div class='nv-box-id'>" + dataset[i][0] + "</div>");
                items.push("<div class='nv-box-img' style='background:" + background + "'></div>");
                items.push("<div class='nv-box-title'>" + dataset[i][1] + "</div>");
                items.push("<div class='nv-box-action'>");
                items.push("<button class='nv-box-action-button'");
                items.push("value='" + dataset[i][0] + "'>Mensaje</button>");
                items.push("</div></div>");
            }
            $("<div/>", {
                "class": "nv-people-list",
                html: items.join("")
            }).appendTo(".nv-people");
            $(".nv-people-list").quickPagination({
                pagerLocation: "bottom",
                pageSize: "9"
            });
        }
    }

    function getUsersOf(people, callback) {
        var query = "MATCH (n:Profile) return count(n)";
        switch (people) {
            case "all":
                query = "MATCH (n:Profile) return n.id,n.name";
                break;
            case "leaders":
				query = "MATCH (n:Profile) WHERE n.closeness<=2 return n.id,n.name";
                break;
            case "key":
                query = "MATCH (n:Profile) return n.id,n.name";
                break;
            case "far":
				query = "MATCH (n:Profile) WHERE n.closeness>=2 return n.id,n.name";
                break;
            case "similar":
                query = "MATCH (n:Profile) return n.id,n.name";
                break;
        }
        var countRequest = $.ajax({
            type: "POST",
            url: neo4jURL + "/db/data/cypher",
            dataType: 'json',
            data: {
                "query": query
            },
            headers: {
                "Authorization": "Basic " + btoa("spribo2:6e0mtjm8OEgoSRpjNhii")
            },
            success: function (data, textStatus, jqXHR) {
                callback(data.data);
            },
            error: function (jqXHR, textStatus, errorThrown) {}
        });
    }

    function getAttributes(word, callback) {
        var searchArray = [];
        var serverURL = "http://localhost:7474/db/data";
        var query = "MATCH (n:Poi) WHERE n.name=~'(?i).*" + word + ".*' RETURN n.name,labels(n) LIMIT 4";
        var request = $.ajax({
            type: "POST",
            url: serverURL + "/cypher",
            accepts: "application/json",
            dataType: "json",
            headers: {
                "X-Stream": "true"
            },
            data: {
                "query": query
            },
            success: function (data, textStatus, jqXHR) {
                callback(data.data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }

    function getCity(word, callback) {
        var searchArray = [];
        var serverURL = "http://localhost:7474/db/data";
        var query = "MATCH (n:Person) WHERE n.city=~'(?i).*" + word + ".*' RETURN DISTINCT n.city LIMIT 4";
        var request = $.ajax({
            type: "POST",
            url: serverURL + "/cypher",
            accepts: "application/json",
            dataType: "json",
            headers: {
                "X-Stream": "true"
            },
            data: {
                "query": query
            },
            success: function (data, textStatus, jqXHR) {
                callback(data.data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }

    function getProfession(word, callback) {
        var searchArray = [];
        var serverURL = "http://localhost:7474/db/data";
        var query = "MATCH (n:Person) WHERE n.profession=~'(?i).*" + word + ".*' RETURN DISTINCT n.profession LIMIT 4";
        var request = $.ajax({
            type: "POST",
            url: serverURL + "/cypher",
            accepts: "application/json",
            dataType: "json",
            headers: {
                "X-Stream": "true"
            },
            data: {
                "query": query
            },
            success: function (data, textStatus, jqXHR) {
                callback(data.data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }
    /*
     * Lighthens an object given an RGB color set.
     * @param		  red: The R-gb value.
     * @param		green: The r-G-b value.
     * @param		 blue: The rG-B value.
     * @param   multiplier: the value to lighthen the object
     * @return  The Lighthen Hex (could be RGB) color set.
     */
    function Lighthen(red, green, blue, multiplier) {
        var r = Math.round(red * multiplier);
        var g = Math.round(green * multiplier);
        var b = Math.round(blue * multiplier);
        if (r > 255) r = 255;
        if (g > 255) g = 255;
        if (b > 255) b = 255;
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    /*
     * Darkens an object given an RGB color set.
     * @param		  red: The R-gb value.
     * @param		green: The r-G-b value.
     * @param		 blue: The rG-B value.
     * @param   multiplier: the value to darken the object
     * @return  The Darkened Hex (could be RGB) color set.
     */
    function Darken(red, green, blue, multiplier) {
        var r = Math.round(red / multiplier);
        var g = Math.round(green / multiplier);
        var b = Math.round(blue / multiplier);
        if (r < 0) r = 0;
        if (g < 0) g = 0;
        if (b < 0) b = 0;
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * Sigma.layout.forceAtlas2
     * plugin:
     *
     * A random graph is generated, such that its nodes are separated in some
     * distinct clusters. Each cluster has its own color, and the density of
     * links is stronger inside the clusters. So, we expect the algorithm to
     * regroup the nodes of each cluster.
     */
    function launchSigmaViz() {
    	var elements = $('.nv-people-list').children().length;
		var title = [];
		try {
		$( ".nv-box-title" ).each(function(){
			title.push($(this).html());
		});
    	console.log(elements);
        var colorScheme;
        var i,
            s,
            o,
            N = elements,//25, //Nodes
            E = Math.random()*10, //Edges
            C = 5,
            d = 0.25,
            cs = [],
            g = {
                nodes: [],
                edges: []
            };
        // Generate the graph:
        for (i = 0; i < C; i++)
        cs.push({
            id: i,
            nodes: []
            //color: "#afde1e" //"#" + Math.random().toString(16).slice(2, 8)
        });

        for (i = 0; i < N; i++) {
            o = cs[(Math.random() * C) | 0];
            g.nodes.push({
                id: 'n' + i,
				label: title[i],
                //    label: 'Person' + i, //Node Label
                x: Math.cos(2 * i * Math.PI / N),
                y: Math.sin(2 * i * Math.PI / N),
				size: 14,
                color: "#afde1e"//o.color            
            });
            o.nodes.push('n' + i);
        }
        for (i = 0; i < E; i++) {
            if (Math.random() < 1 - d) g.edges.push({
                id: 'e' + i,
                source: 'n' + ((Math.random() * N) | 0),
                target: 'n' + ((Math.random() * N) | 0),
				color: "#b3b3b3"
            });
            else {
                o = cs[(Math.random() * C) | 0]
                g.edges.push({
                    id: 'e' + i,
                    source: o.nodes[(Math.random() * o.nodes.length) | 0],
                    target: o.nodes[(Math.random() * o.nodes.length) | 0],
                    color: "#b3b3b3"
                });
            }
        }
        s = new sigma({
            graph: g,
            container: 'graph-container',
            settings: {
				font: "Gill Sans",
				labelHoverShadowColor: '#cccccc',
				defaultHoverLabelBGColor: '#fff',
                drawEdges: true,
            }
        });
        // Start the ForceAtlas2 algorithm:
        s.startForceAtlas2();
		}
		catch(err) {
			//console.log(err+"asd");
			//The edge source must have an existing node id
			launchSigmaViz();
		}
    } // Sigma-JS-End. 

    /**** BUTTON ACTIONS *****/
    $(".nv-container").on("click", ".nv-box-action-button", function () {
        eval($("network-view").attr("onMessage"));
    });

});