(function(obj, $) {
    if (obj.__ !== undefined) {
        return;
    }
    var uniqueInt = 0, types = function(obj) {
        var regex = /\[object\s+(\w+)\]/i, tt = Object.prototype.toString.call(obj), re = regex.exec(tt);
        return (re && re.length > 0) ? re[1].toLowerCase() : 'error';
    }, debug = function($obj) {
        if (console && console.dir) {
            console.dir($obj);
        }
    }, logger = function(level) {
        var config = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: level,
            methodMap: {
                0: 'debug',
                1: 'info',
                2: 'warn',
                3: 'error'
            }
        };
        return function(level, obj) {
            if (config.level <= level) {
                var method = config.methodMap[level];
                if (typeof console !== 'undefined' && console[method]) {
                    console[method].call(console, obj);
                }
            }
        };
    }, datePickerDefaultParam = {
        dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
        dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        nextText: "更晚",
        prevText: "更早",
        showButtonPanel: false,
        changeYear: true,
        changeMonth: true,
        dateFormat: 'yy-mm-dd'
    }, table_zh_cn = {
        "sProcessing": "...处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "未找到您要的信息",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        }
    }, dataTableDefaultParam = {
        'bAutoWidth': true,
        'bJQueryUI': false,
        //"sPaginationType":"full_numbers",
        "iDisplayLength": 10,
        'aLengthMenu': [[10, 25, 50, 100], [10, 25, 50, 100]],
        "bDestroy":true,
        "bRetrieve": true,
        'oLanguage': table_zh_cn,
        "sDom": "<'row-fluid'<'span6'l><'span6 hidden'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        'sPaginationType': "bootstrap"
    }, ajaxErrorHandler = {
        '400': function(obj, s) {
            projectLib.alert("请检查您的输入是否正确，或者可能网络出现了异常");
        },
        '401': function(obj, s) {
            projectLib.alert("您还没有登录，或者没有权限访问该功能");
        },
        '403': function(obj, s) {
            projectLib.alert('抱歉，您需要先登录有此权限的帐号才能使用该功能');
        },
        '404': function(obj, s) {
            projectLib.alert("可能您需要刷新网页，所使用的数据未找到");
        },
        '409': function(obj, s) {
            projectLib.alert("当前状态下，操作无法完成");
        },
        '500': function(obj, s) {
            projectLib.alert("系统出错，请重试");
        },
        '503': function(obj, s) {
            projectLib.alert("系统出错，请重试");
        },
        '0': function(obj, s) {
            projectLib.alert("所连接的网站无响应，请检查网络连接是否正常");
        }
    }, ajax = function(url, param, callback, method, contentType, options) {
        var requestParam;
        if (types(param) === "string") {
            requestParam = param;
        } else if (types(param) === "object") {
            requestParam = {};
            requestParam = $.extend({}, param, {
                t: (new Date()).getTime()
            });
        }
        var errHandler = projectLib.param.ajaxDefaultErrorHandler;
        if (options && options.errHandler !== undefined) {
            errHandler = $.extend(errHandler, options.errHandler);
        }
        if (method === undefined) {
            method = 'GET';
        }
        var requestObj = {
            url: url,
            type: method,
            timeout:80000, 
            data: requestParam,
            dataType: "text"
        };
        if (contentType !== undefined) {
            requestObj.contentType = contentType;
        }
        var request = $.ajax(requestObj);
        request.done(function(msg) {
            if ($.isFunction(callback)) {
                msg = $.trim(msg);
                callback.apply(this, [msg]);
            }
        });
        request.fail(function(jqXHR, textStatus) {
            var s = jqXHR.status;
            if (s in errHandler) {
                errHandler[s].apply(this, [jqXHR, s]);
            } else {
                projectLib.alert("未知错误发生");
            }
            if(options && options.retureWhatever){
                if ($.isFunction(callback)) {
                    callback.apply(this, ['']);
                }
            }
        });
        return request;
    }, dialogDefaultParam = {
        dialogClass: 'no-close',
        minHeight: 170,
        minWidth: 300,
        width: 570,
        modal: true,
        autoOpen: false,
        show: {
            effect: "drop",
            duration: 500
        },
        hide: {
            effect: "blind",
            duration: 500
        }
    }, dialogFactory = function(type, tt) {
        var tag = '-' + (new Date().getTime());
        type = type || 'common-alert', tt = tt || '信息';
        var idstr = 'i-' + type + tag,
        modal = '<div id="' + idstr + '"  title=""><div class="modal-header"><h3></h3></div><div class="modal-body"></div><div class="modal-footer"><button class="btn btn-success">确认</button><button class="btn bt-dialog-close">关闭</button></div></div>';
        //projectLib.insertHidenEl(modal, 'info-container');
        var o = $(modal).attr('title', tt);
        var $btn = o.find('.modal-footer .btn-success'), $bt = o.find('.modal-footer .bt-dialog-close').click(function(event) {
            o.dialog('close');
        }), $body = o.find('.modal-body'), $title = o.find('.modal-header h3');
        return function(msg, callback, ops) {
            if (callback && types(callback) === 'function') {
                $btn.html('确认').unbind('click').show().click(function() {
                    callback.apply(o, []);
                    o.dialog('close');
                });
            } else {
                $btn.hide();
                if (types(callback) === 'object') {
                    ops = callback;
                }
            }
            var param = projectLib.param.dialogDefaultParam;
            if (ops) {
                if (ops.buttonText) {
                    $bt.html(ops.buttonText);
                }
                if (ops.title) {
                    $title.html(ops.title);
                }
                if (ops.confirmText) {
                    $btn.html(ops.confirmText);
                }
                if (types(ops.prepare) === 'function') {
                    ops.prepare.apply(o, [msg]);
                }
                if (types(ops.param) === 'object') {
                    param = $.extend({}, param, ops.param);
                }
            }
            $body.html("").append(msg);
            o.dialog(param).dialog('open');
        };
    }, renderBuilder = function() {
        var render = Handlebars;
        render.registerHelper('prop', function(context, options) {
            var ret = "";
            if (context) {
                ret = context + '="' + context + '"';
            }
            return new render.SafeString(ret);
        });
        render.registerHelper('html', function(context, options) {
            var ret = context || "";
            return new render.SafeString(ret);
        });
        render.registerHelper('dateFormatter', function(context, options) {
            var ret = dateFormatter(context) || "";
            return new render.SafeString(ret);
        });
        render.registerHelper('dateTimeFormatter', function(context, options) {
            var ret = dateTimeFormatter(context) || "";
            return new render.SafeString(ret);
        });
        render.registerHelper('isOrNot', function(context, options) {
            return (context) ? "是" : "否";
        });
        render.registerHelper('checkbox', function(context, option) {
            return (context) ? '<input type="checkbox" checked="checked"  />' : '<input type="checkbox" />';
        });
        render.registerHelper('iterator', function(context, options) {
            var ret = "", data, count = 0;
            for (var i in context) {
                if (options.data) {
                    data = render.createFrame(options.data || {});
                    data.innerIndex = i;
                    data.count = count;
                }
                ret += options.fn(context[i], {
                    data: data
                });
                count++;
            }
            return ret;
        });
        render.registerHelper('test', function(context, options) {
            var vv = options.hash['val'], val, v;
            if (vv.indexOf(',') > 0) {
                val = vv.split(',');
                if ($.inArray(context, val) >= 0)
                    return options.fn(this);
                else
                    return options.inverse(this);
            } else {
                if (vv === (context + '')) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
        });
        renderBuilder = function() {
            return render;
        }
        return render;
    }, dateFormatter = function(ad) {
        if (types(ad) === 'number') {
            ad = new Date(ad);
        } else if (types(ad) === 'string') {
            ad = new Date(ad);
            if (/Invalid|NaN/i.test(ad)) {
                return '';
            }
        } else if (types(ad) === 'date') {

        } else {
            return '';
        }
        return ad.getFullYear() + "-" + prefixZero(ad.getMonth() + 1) + "-" + prefixZero(ad.getDate()) + " ";
    }, dateTimeFormatter = function(ad) {
        if (types(ad) === 'number') {
            ad = new Date(ad);
        } else if (types(ad) === 'string') {
            ad = new Date(ad);
            if (/Invalid|NaN/i.test(ad)) {
                return '';
            }
        } else if (types(ad) === 'date') {

        } else {
            return '';
        }
        return ad.getFullYear() + "-" + prefixZero(ad.getMonth() + 1) + "-" + prefixZero(ad.getDate()) + " " + prefixZero(ad.getHours()) + ":" + prefixZero(ad.getMinutes());
    }, timeToNow = function(time) {
        time = time + 0;
        if (!time) {
            return '';
        }
        var now = new Date();
        var cur = now.getTime();
        var ss = cur - time;
        ss = ss / 1000;
        if (ss < 60) {
            return ss + "秒前";
        } else if (ss < 3600) {
            return Math.round(ss / 60) + "分钟前";
        } else if (ss < 86400) {
            return Math.round(ss / 3600) + "小时前";
        } else if (ss < 864000) {
            return Math.round(ss / 864000) + "天前";
        } else {
            return dateTimeFormatter(time);
        }
    }, prefixZero = function(i) {
        if (types(i) === 'number')
            return i <= 9 ? '0' + i : i;
        else
            return '0' + i;
    }, len = function(obj, flag) {
        var count = 0;
        if (types(obj) === 'array') {
            count = obj.length;
        } else if (types(obj) === 'string') {
            if (flag) {
                for (var i = 0, n = obj.length; i < n; i++) {
                    if (obj.charCodeAt(i) > 1024) {
                        count += 2;
                    } else {
                        count += 1;
                    }
                }
            } else {
                count = obj.length;
            }
        } else if (types(obj) === 'object') {
            if (!flag) {
                for (var i in obj) {
                    count++;
                }
            } else {
                for (var i in obj) {
                    if (obj[i])
                        count++;
                }
            }
        }
        return count;
    },wrapWord=function(msg,n,stuff){
        if(msg.length<n){
            return msg;
        }else{
            var ret='';
            while(msg.length>n){
                var m=msg.substr(0,n);
                msg=msg.substr(n);
                ret+=m+stuff;
            }
            ret+=msg;
            return ret;
        }
    }, cookieExtractor = function() {
        var reg = /([a-z1-9_]+)=([^=]+)/i;
        return function(str) {
            if (types(str) === "string") {
                var cookies = str.split(';'), ret = {};
                for (var k in cookies) {
                    var cookie = cookies[k],
                    items = reg.exec(cookie);
                    if (items && items.length > 1) {
                        var ss = decodeURI(items[2]);
                        ret[items[1]] = ss;
                    }
                }
                return ret;
            }
            return {};
        };
    }, datepicker = function(selector, val, config) {
        if (types(val) === 'object') {
            config = val;
        }
        var $obj;
        if (types(selector) === 'string') {
            $obj = $(selector);
        } else {
            $obj = selector;
        }

        var ret, defaultParam = projectLib.param.datePickerDefaultParam;
        __.debug($obj);
        if ($obj.length === 1) {
            if (config) {
                ret = $obj.datepicker($.extend({}, defaultParam, config));
            } else {
                ret = $obj.datepicker(defaultParam);
            }
            if (val) {
                //__.debug(val);
                ret.datepicker("option", "defaultDate", val);
            }
        } else {
            var aret, ids = {};
            ret = [];
            $obj.each(function() {
                var $this = $(this), id = $this.attr('id');
                if (!id || ids[id]) {
                    id = 'datapicker-' + (uniqueInt++);
                    $this.attr('id', id);
                }
                ids[id] = true;
                if (config) {
                    aret = $('#' + id).datepicker($.extend({}, defaultParam, config));
                } else {
                    aret = $('#' + id).datepicker(defaultParam);
                }
                __.debug(aret);
                if (val) {
                    //__.debug(val);
                    aret.datepicker("option", "defaultDate", val);
                }
                ret.push(aret);
            });
        }
        return ret;
    }, autoCompleteFactory = function(source) {
        var defaultParam = {
            minLength: 2,
            source: source
        };
        return;
    }, autoComplete = function(selector, source, select, param) {
        var type = types(source), cache = {}, ret;
        if (type === 'string') {
            if (!cache[source]) {
                cache[source] = {};
            }
            ret = $(selector).autocomplete({
                minLength: 1,
                source: function(request, response) {
                    var term = request.term, ch = cache[source];
                    if (term in ch) {
                        response(ch[ term ]);
                        return;
                    }
                    ajax(source, request, function(msg) {
                        var data = JSON.parse(msg);
                        ch[ term ] = data;
                        response(data);
                    },undefined,undefined,{retureWhatever:true});
                }
            });
        } else if (type === 'array' || type === 'function') {
            ret = $(selector).autocomplete({
                minLength: 1,
                source: source
            });
        }
        if (types(select) === 'function') {
            ret.on("autocompleteselect", function(event, ui) {
                select.apply(ret, [event, ui]);
            });
        }
        ret.data("ui-autocomplete")._renderItem = function(ul, item) {
            var tp = projectLib.data.renders['autocomplete'], html;
            //__.debug(tp);
            if (tp === undefined) {
                var template = '<li class="b_border"><a><b>{{label}}</b>&nbsp;<span>{{description}}</span></a></li>';
                tp = projectLib.render.compile(template);
                projectLib.data.renders['autocomplete'] = tp;
            }
            html = tp(item);
            return $(html).appendTo(ul);
        };
        return ret;
    }, requireJs = function(jsUrl, flag, param) {
        if (flag) {
            param = param || {};
            ajax(jsUrl, param, function(msg) {
                $("head").append('<script type="text/javascript" >' + msg + '</script>');
            });
        } else {
            $('head').append('<script type="text/javascript" src="' + jsUrl + '"></script>');
        }
    }, registerCss = function(css) {
        $("head").append('<link href=' + css + ' type="text/css" rel="stylesheet" />');
    }, dataTables = function(selector, config, simple) {
        __.debug(projectLib.param.dataTablesDefaultParam);
        if (!config) {
            return $(selector).addClass("table table-striped table-bordered dataTable table-hover").dataTable(projectLib.param.dataTablesDefaultParam);
        } else {
            return $(selector).addClass("table table-striped table-bordered dataTable table-hover").dataTable($.extend({}, projectLib.param.dataTablesDefaultParam, config));
        }
        return undefined;
    }, form = function() {
        var render = renderBuilder();
        var form_template = {
            select: '<div class="input-prepend input-append"> {{#if f_icon}} <span class="add-on">{{html f_icon}}</span> {{/if}} <select {{prop mutiple}} id="{{id}}" class="{{classes}}" name="{{name}}" {{prop disabled}} > {{#each options}} <option id="{{id}}" value="{{val}}" {{prop selected}} {{prop disabled}}>{{title}}</option> {{/each}} </select> {{#if p_icon}} <span class="add-on">{{html p_icon}}</span> {{/if}} </div>',
            text: '<div class="input-prepend input-append"> {{#if f_icon}} <span class="add-on">{{html f_icon}}</span> {{/if}} <input type="text" id="{{id}}" placeholder="{{msg}}" value="{{val}}" class="{{classes}}" name="{{name}}" {{prop disabled}}/> {{#if p_icon}} <span class="add-on">{{html p_icon}}</span> {{/if}} </div>',
            password: '<div class="input-prepend input-append"> {{#if f_icon}} <span class="add-on">{{f_icon}}</span> {{/if}} <input type="password" id="{{id}}" placeholder="{{msg}}" value="{{val}}" class="{{classes}}" name="{{name}}"/> {{#if p_icon}} <span class="add-on">{{p_icon}}</span> {{/if}} </div>',
            file: '<div class="input-prepend input-append"> {{#if f_icon}} <span class="add-on">{{f_icon}}</span> {{/if}} <input type="file" id="{{id}}"  value="{{val}}" class="{{classes}}" name="{{name}}"/> {{#if p_icon}} <span class="add-on">{{p_icon}}</span> {{/if}} </div>',
            checkbox: '<label class="checkbox inline"> <input type="checkbox" id="{{id}}" value="{{val}}" {{prop checked}} class="{{classes}}" name="{{name}}"/> {{title}} </label>',
            radio: '<div>{{#each items}} <label class="radio inline"> <input type="radio" id="{{../id}}-{{@index}}" value="{{val}}" class="{{../classes}}" name="{{../name}}" {{prop checked}}/> {{title}} </label> {{/each}}</div>',
            textarea: '<div><textarea id="{{id}}" name="{{name}}" rows="{{rows}}" {{prop disabled}}>{{val}}</textarea></div>',
            hidden: '<span><input type="hidden" id="{{id}}" value="{{val}}"  name="{{name}}"/></span>',
            element_wrapper: '<div id={{id}} class="control-group {{classes}}"><label class="control-label" for="{{name}}">{{html title}}</label><div class="controls"></div><span class="help-block">{{hint}}</span></div>'
        //            element_prefix: '<div class="control-group {{classes}}">',
        //            element_appendix: '</div>'
        }, validator = (function() {
            var methods = {
                minlength: function(value, param) {
                    return $.trim(value).toString().length >= param;
                },
                maxlength: function(value, param) {
                    return $.trim(value).length <= param;
                },
                rangelength: function(value, param) {
                    var length = $.trim(value).length;
                    //alert(length);
                    return (length >= param[0] && length <= param[1]);
                },
                min: function(value, param) {
                    return value >= param;
                },
                max: function(value, param) {
                    return value <= param;
                },
                range: function(value, param) {
                    return (value >= param[0] && value <= param[1]);
                },
                email: function(value) {
                    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
                },
                url: function(value) {
                    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
                    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
                },
                date: function(value) {
                    return !/Invalid|NaN/.test(new Date(value));
                },
                dateISO: function(value) {
                    return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
                },
                number: function(value) {
                    return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
                },
                digits: function(value) {
                    return /^\d+$/.test(value);
                },
                // based on http://en.wikipedia.org/wiki/Luhn
                creditcard: function(value) {
                    if (/[^0-9 -]+/.test(value))
                        return false;
                    var nCheck = 0,
                    nDigit = 0,
                    bEven = false;
                    value = value.replace(/\D/g, "");
                    for (var n = value.length - 1; n >= 0; n--) {
                        var cDigit = value.charAt(n), nDigit = parseInt(cDigit, 10);
                        if (bEven) {
                            if ((nDigit *= 2) > 9)
                                nDigit -= 9;
                        }
                        nCheck += nDigit;
                        bEven = !bEven;
                    }
                    return (nCheck % 10) === 0;
                },
                regexp: function(value, param) {
                    //param = (typeof param == "string") ? param: "png|jpe?g|gif";
                    return value.match(new RegExp("^" + param + "$", "i"));
                }
            },
            msgs = {
                minlength: '需要至少_p_个字',
                min: '不能小于_p_哦',
                maxlength: '最多只能填_p_个字',
                max: '不能大于_p_哦',
                range: '需要在_p1_到_p2_之间取值',
                rangelength: '长度要在_p1_和_p2_之间哦',
                date: '需要标准的日期格式，例2012-09-01',
                email: '需要标准的email格式,例：abc_d@abc.com',
                number: '需要可识别的整数或小数表达式',
                digits: '只能填0-9的数字组合哦',
                url: '需要符合规范的链接地址',
                regexp: '输入不符合格式要求',
                fileChoosed:'请选择文件'
            },
            showHint = function(type, param, hint) {
                //alert(hint);
                var msg, t = types(param);
                msg = hint || msgs[type] || "输入有误";
                //                    if (hint !== undefined) {
                //                        msg = hint;
                //                    } else if (this[type] !== undefined) {
                //                        msg = this[type];
                //                    } else {
                //                        msg = "输入有误";
                //                    }
                if (t === 'string' || t === 'number') {
                    //alert(t);
                    msg = msg.replace('_p_', param);
                } else if (t === 'array') {
                    msg = msg.replace('_p1_', param[0]).replace('_p2_', param[1]);
                }
                return msg;
            };
            return {
                func: methods,
                msg: showHint
            };
        })(), templates = (function() {
            var ret = {};
            for (var t in form_template) {
                ret[t] = render.compile(form_template[t]);
            }
            return ret;
        })(), index = 0, elIndex = 0, formIndex = 0;
        function FormHandler() {
            if (!(this instanceof FormHandler))
                return new FormHandler();
            this.data = {}, this.config = undefined, this.els = {}, this.inputs = {}, this.hint = {}, this.errMsg = {}, this.$form = undefined;
        //return ;
        }
        FormHandler.prototype = {
            build: function(selector, ee) {
                var els = $.extend(true, {}, ee);
                this.config = els;
                for (var i in els) {
                    var el = els[i], inputHtml = [], inputs = el.inputs;
                    //this.rules=el.rules;
                    for (var ii in inputs) {
                        var input = inputs[ii], nm = input.name, type = input.type || "text", tp = templates[type];
                        if (tp) {
                            var id = 'in-' + (index++);
                            __.debug(index);
                            input.id = input.id || id;
                            var inputText = tp(input);
                            //__.debug(inputText);
                            var $obj = $(inputText);
                            var $inObj = $obj.find('input,select,textarea');
                            this.inputs[nm] = {
                                obj: $inObj,
                                type: type,
                                index: ii,
                                parentIndex: i,
                                id: input.id,
                                rules: input.rules || []
                            };
                            inputHtml.push($obj);
                        }
                    }
                    var elId = 'el-' + (elIndex++), wrapperParam = $.extend({}, {
                        id: elId,
                        hint: " "
                    }, el),
                    elText = templates['element_wrapper'](wrapperParam), $elObj = $(elText), $conObj = $elObj.find('.controls');
                    for (var iii in inputHtml) {
                        $conObj.append(inputHtml[iii]);
                    }
                    //html.push($elObj);
                    this.els[i] = $elObj;
                    this.hint[i] = el.hint || "";
                }
                var selectorType = types(selector), $form, htmlEl = this.els;
                if (selectorType === 'string') {
                    var $formWrapper = $(selector);
                    if ($formWrapper.is('form')) {
                        $form = $formWrapper.attr('id', 'form-' + (formIndex++)).addClass("form-horizontal");
                    } else if ($formWrapper.length > 0) {
                        $formWrapper.append('<form id="form-' + (formIndex++) + '" class="form-horizontal"></form>');
                        $form = $formWrapper.find('form');
                    } else {
                        $form = $('<form id="form-' + (formIndex++) + '" class="form-horizontal"></form>');
                    }
                } else if (selectorType === 'object' && selector.is("form")) {
                    $form = selector.attr('id', 'form-' + (formIndex++)).addClass("form-horizontal");
                } else {
                    $form = $('<form id="form-' + (formIndex++) + '" class="form-horizontal"></form>');
                }
                for (var it in htmlEl) {
                    $form.append(htmlEl[it]);
                }
                this.$form = $form;
                return this;
            },
            set: function(data) {
                for (var nm in data) {
                    var input = this.inputs[nm];
                    if (input) {
                        var type = input.type;
                        if (type === 'text' || type === 'textarea' || type === 'hidden') {
                            if (input.rules && input.rules[0] && input.rules[0].name === 'date') {
                                input.obj.val(dateFormatter(data[nm]));
                            } else {
                                input.obj.val(data[nm]);
                            }
                        } else if (input.type === 'checkbox') {
                            if (data[nm]) {
                                input.obj.attr('checked', 'checked');
                            } else {
                                input.obj.removeAttr('checked');
                            }
                        } else if (input.type === 'radio') {
                            input.obj.find('[value="' + data[nm] + '"]').attr('checked', 'checked');
                        } else if (type === 'select') {
                            var dt = data[nm];
                            __.log(1, 'value');
                            __.debug(dt);
                            if (input.obj.attr('multiple')) {
                                if (types(dt) === 'array') {
                                    input.obj.find('option').each(function() {
                                        var $this = $(this), val = $this.val();
                                        //__.log(1,val);
                                        if ($.inArray(val, dt) >= 0) {
                                            $this.attr('selected', 'selected');
                                        } else {
                                            $this.removeAttr("selected");
                                        }
                                    });
                                }
                            } else {
                                input.obj.val(dt);
                            }
                        }
                    }
                }
                return this;
            },
            clear: function() {
                var inputs = this.inputs, els = this.els;
                for (var nm in inputs) {
                    var input = inputs[nm], type = input.type;
                    if (type === 'text' || type === 'textarea' || type === 'password' || type === 'hidden') {
                        input.obj.val('');
                    } else if (input.type === 'checkbox') {
                        input.obj.removeAttr('checked');
                    } else if (input.type === 'radio') {
                        input.obj.first().attr('checked', 'checked');
                    } else if (type === 'select') {
                        if (input.obj.attr('multiple')) {
                            input.obj.find('option').each(function() {
                                $(this).removeAttr("selected");
                            });
                        }
                    }
                }
                for (var ii in els) {
                    this.toggleErr(ii, false);
                }
                return this;
            },
            getItemData: function(nm) {
                var input = this.inputs[nm], type = input.type;
                if (type === 'text' || type === 'select' || type === 'textarea' || type === 'password' || type === 'hidden') {
                    return input.obj.val();
                } else if (input.type === 'checkbox') {
                    if (input.obj.is(':checked')) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (input.type === 'radio') {
                    return input.obj.find(':checked').val();
                } else if (input.type === 'file') {
                    return '';
                }
                return;
            },
            get: function() {
                var ret = {}, inputs = this.inputs;
                for (var nm in inputs) {
                    ret[nm] = this.getItemData(nm);
                //                    var input = inputs[nm], type = input.type;
                //                    if (type === 'text' || type === 'select' || type === 'textarea' || type === 'password') {
                //                        ret[nm] = input.obj.val();
                //                    } else if (input.type === 'checkbox') {
                //                        if (input.obj.is(':checked')) {
                //                            ret[nm] = true;
                //                        } else {
                //                            ret[nm] = false;
                //                        }
                //                    } else if (input.type === 'radio') {
                //                        ret[nm] = input.obj.find(':checked').val();
                //                    }
                }
                return ret;
            },
            check: function(hideErr) {
                var ret = [], inputs = this.inputs;
                for (var nm in inputs) {
                    var input = inputs[nm], flag = true, err;
                    if (input.rules.length > 0) {
                        var rules = input.rules, val = this.getItemData(nm);
                        for (var i in rules) {
                            var rule = rules[i], func = validator.func[rule.name];
                            if (func) {
                                if (!func.apply(this, [val, rule.param])) {
                                    flag = false;
                                    err = validator.msg(rule.name, rule.param);
                                    break;
                                }
                            }
                        }
                    }
                    if (!flag) {
                        ret.push(nm);
                        if (!hideErr) {
                            this.toggleErr(input.parentIndex, true, err);
                        }
                    } else {
                        if (!hideErr) {
                            this.toggleErr(input.parentIndex, false);
                        }
                    }
                }
                return ret;
            },
            toggleErr: function(i, flag, msg) {
                var obj = this.els[i];
                __.debug(obj);
                if (flag) {
                    obj.addClass('error');
                    obj.find('.help-block').html(msg);
                } else {
                    obj.removeClass('error');
                    obj.find('.help-block').html(this.hint[i]);
                }
            },
            getInput: function(name) {
                if (name !== undefined) {
                    return this.inputs[name];
                } else {
                    return this.inputs;
                }
            },
            getForm: function() {
                return this.$form;
            },
            submit:function(url,f){
                if(url){
                    this.$form.attr('action',url);
                }
                if(f){
                    var inputs=this.inputs;
                    for(var i in inputs){
                        var input=inputs[i],
                        val=input.obj.val(),nval=encodeURIComponent(val);
                        if(input.type==='text' ||input.type==='textarea' )
                            input.obj.val(nval);
                    }
                }
                this.$form.submit();
            }
        };
        return FormHandler;
    }, scrollTo = function(selector) {
        var $obj;
        if (types(selector) === 'string') {
            $obj = $(selector);
        } else if (types(selector) === 'object') {
            $obj = selector;
        }
        var pos = $obj.position();
        obj.scroll(0, pos.top);
        return $obj;
    }, projectLib = {
        'log': logger(0), //done
        'debug': debug, //done
        'inOutData': ajax, //done
        'alert': dialogFactory('alert'),
        'confirm': dialogFactory('confirm', '确认'),
        'requireJs': requireJs,
        'requireCss': registerCss,
        'render': renderBuilder(),
        'getType': types,
        'dataTable': dataTables,
        'scrollTo': scrollTo,
        _time_limit: 1609372800000,
        'init': init,
        'widget': {
            'form': form(),
            'dataTable': dataTables,
            'datePicker': datepicker,
            'autoComplete': autoComplete
        },
        'data': {
            template: {
                project_basic_info: '',
                project_event_info: '',
                project_package_info: '',
                project_manager_info: '',
                project_notary_info: '',
                project_expert_info: '',
                project_expert_select_panel: '',
                project_bidder_info: ''
            },
            user: {},
            sys_type: {},
            renders: {}
        },
        'param': {
            datePickerDefaultParam: datePickerDefaultParam,
            dataTablesDefaultParam: dataTableDefaultParam,
            ajaxDefaultErrorHandler: ajaxErrorHandler,
            dialogDefaultParam: dialogDefaultParam
        },
        'util': {
            'dateFormatter': dateFormatter,
            'dateTimeFormatter': dateTimeFormatter,
            'timeToNow': timeToNow,
            'prefixZero': prefixZero,
            'len':len,
            'cookieEx': cookieExtractor(),
            'wrapWord':wrapWord
        },
        'config': {
    }
    };
    if (obj.__ === undefined) {
        obj.__ = projectLib;
    } else {
        alert("js error");
    }
})(window, jQuery);
