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
/* Social List Component.
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
       document.registerElement('social-list', {
                                prototype: Object.create(HTMLElement.prototype)
                                });
       } else {
       /* Not supported what do I do?*/
       }
       
       var prefix = "census";
       var jsonData = $("social-list").attr("data");
       var sLeftTab = "< Personas Interesantes";
       var scenterTab = "Personas que quizás conozcas";
       var srightTab = "Líderes de Opinión >";
       var imgsrc = "";
       var actionbutton1 = "";
       var actionbutton2 = "";
/* Layout Make */
       $("social-list").append("<div class=\"sl-container\"></div>");
       $(".sl-container").append("<div class=\"sl-tab-bar\"></div>");
       $(".sl-tab-bar").append("<div class=\"sl-left-tab\">" + sLeftTab + "</div>");
       $(".sl-tab-bar").append("<div class=\"sl-center-tab\">" + scenterTab + "</div>");
       $(".sl-tab-bar").append("<div class=\"sl-right-tab\">" + srightTab + "</div>");
       
       setupData("mayKnow");
       function setupData(datashow) {
       $.getJSON(jsonData+'&callback=?', function (data) {
                 var items = [];
                 var dataset;
                 switch (datashow) {
                 case "keyPeople":
                 dataset = data.keyPeople;
                 break;
                 case "opinionLeaders":
                 dataset = data.opinionLeaders;
                 break;
                 case "peopleAway":
                 dataset = data.peopleAway;
                 break;
                 case "mayKnow":
                 dataset = data.mayKnow;
                 break;
                 case "shouldKnow":
                 dataset = data.shouldKnow;
                 break;
                 }
                 $.each(dataset, function (key, value) {
                        items.push("<div class='sl-box'>");
                        items.push("<div class='sl-hidden-id'" + this.guid + "</div>");
                        items.push("<div class='sl-img-box'><img src=" + this.picture + "/></div>");
                        items.push("<div class='sl-metadata-box'>");
                        items.push("<div class='sl-lead-meta'>" + this.name + "</div>");
                        // items.push("<div class=\"\">"+ this.company + "</div>");
                        items.push("<div class='sl-sub-meta'>" + this.location + "</div></div>");
                        items.push("<div class='sl-action-box'>");
                        items.push("<button class='sl-first-action'");
                        items.push("value=" + this.guid + ">Agregar</button>");
                        items.push("<button class='sl-second-action'");
                        items.push("value=" + this.guid + ">Mensaje</button></div>");
                        items.push("</div></div>");
                        });
                 $("<div/>", {
                   "class": "sl-box-container",
                   html: items.join("")
                   }).appendTo(".sl-container");
                 });
       }
/* Event Handler*/
       $(".sl-left-tab").click(function () {
                            $(".sl-box-container").fadeOut(100, function () {
                                                        $(this).remove();
                                                        if ($("div.center-tab").text() == "Personas que quizás conozcas") {
                                                        $("div.sl-right-tab").text("Personas que quizá conozcas >");
                                                        $("div.sl-center-tab").text("Personas Interesantes");
                                                        $("div.sl-left-tab").text("");
                                                        setupData("keyPeople");
                                                        } else if ($("div.center-tab").text() == "Líderes de Opinión") {
                                                        $("div.sl-right-tab").text(srightTab);
                                                        $("div.sl-center-tab").text(scenterTab);
                                                        $("div.sl-left-tab").text(sLeftTab);
                                                        setupData("mayKnow");
                                                        }
                                                        });
                            });
       
       $(".sl-right-tab").click(function () {
                             $(".sl-box-container").fadeOut(100, function () {
                                                         $(this).remove();
                                                         if ($("div.sl-center-tab").text() == "Personas que quizás conozcas") {
                                                         $("div.sl-right-tab").text("");
                                                         $("div.sl-center-tab").text("Líderes de Opinión");
                                                         $("div.sl-left-tab").text("< Personas que quizá conozcas");
                                                         setupData("opinionLeaders");
                                                         } else if ($("div.sl-center-tab").text() == "Personas Interesantes") {
                                                         $("div.sl-right-tab").text(srightTab);
                                                         $("div.sl-center-tab").text(scenterTab);
                                                         $("div.sl-left-tab").text(sLeftTab);
                                                         setupData("mayKnow");
                                                         }
                                                         });
                             });
       
       $(".sl-container").on("click", ".sl-first-action", function () {
                          eval($("social-list").attr("onAdd"));
                          });
       
       $(".sl-container").on("click", ".sl-second-action", function () {
                          eval($("social-list").attr("onMessage"));
                          });
       });