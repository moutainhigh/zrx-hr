/**
 * 动态多选控件
 * @author dingxiangyong
 * @author 2015-11-23
 */
(function(window, document, undefined) {
	//搜索内容默认模板
	var searchHtml = {
		//整体布局
		wrap: "<div style='float:left;border: 1px solid #C4C4C4;border-radius: 2px 2px 2px 2px;width:&widthpx;'><div id='&inputid_chzn' class='chzn-container chzn-container-multi chzn-container-multi' > " +
                                           "<ul class='chzn-choices' style='border:0'> " +
                                           "<li class='search-field'></li> " +
                                        "</ul> " +
                                       "</div></div>",
        //中间插入模板
		tempInputContent: "<li class='search-choice' id='&inputid_chzn_c_&choiceid'><span>&content</span><a href='javascript:void(0)' class='search-choice-close tn-kalendea-choice-close' rel='&choiceid'></a></li>",
	};
    
    /**
	 * DynamicMultiInputForTnSearch构造函数
	 * @param <String> selector 选择器
     * @callback function 点击文本框后的回调函数
     * @itemIsValidCallBack 输入框发生blur事件时，调用该方法判断是否合法，如果合法则添加入组件，不合法则报错
     * @deletable 生成的按钮是否可删除，true:可删除，false：不可删除
	 * @return <void>
	 */
	var DynamicMultiInputForTnSearch = function DynamicMultiInputForTnSearch(selector, callback, itemIsValidCallBack, deletable) {
        this.init.call(this, $(selector), callback);
        this.eventBind.call(this, $(selector), itemIsValidCallBack, deletable);
        
    };
    
    
    $.extend(DynamicMultiInputForTnSearch.prototype, {
        
        //初始化
        init: function(el, callback) {
			var self = this;
            
            $.each(el, function(i ,item){
                var inputDom = $(item);
                var width = $(item).width();
                //inputDom.attr('style', 'width: 100%;');
                inputDom.attr('style', 'border: 0;width: 95%;');
                
                var inputid = item.id;
                var html = searchHtml.wrap.replace(/&inputid/g, inputid);
                html = html.replace(/&width/g, width+9);
                html = $(html);
                $('.chzn-choices', html).after(inputDom.clone(true));
                
                //插入控件
                $("#" + inputid).after(html);
                //删除原有日期输入框
                $("#" + inputid + ":first").remove();
                
                //绑定控件弹出事件
                //$("#" + inputid, html).unbind("click").click(function(e) {
                    if (typeof(callback) == 'function')
                    {
                        callback();
                    }
                //});

                $(".chzn-select", html).chosen();
            });
        },
        
		//绑定生成选项事件
		eventBind: function(el, itemIsValidCallBack, deletable) {
			var self = this;
			$.each(el, function(i, item){
                var inputid = item.id;
                
                $(item).blur(function() {
                    var value = $(this).val();
                    if (value && typeof(itemIsValidCallBack) == 'function' && itemIsValidCallBack($(this))) {
                        var choiceid = $('#' + inputid + "_chzn>ul:first>li").length;
                        var choice = searchHtml.tempInputContent.replace(/&inputid/g, inputid);
                        choice = choice.replace(/&content/g, value);
                        choice = choice.replace(/&choiceid/g, choiceid);
                        
                        var html = $(choice);
                        
                        //绑定关闭事件
                        $('.tn-kalendea-choice-close', html).unbind("click").click(function(e){
                            $("#" + inputid + "_chzn_c_" + choiceid).remove();
                        })
                        //如果不可删除，则干掉删除按钮
                        if (!deletable)
                        {
                            $("a.search-choice-close", html).remove();
                        }
                        //添加到输入框中
                        $('#' + inputid + "_chzn>ul>li[class='search-field']").before(html);
                        $(this).val('');
                    } else {
                        return;
                    }
                });
                
            });
		},
    });
    
    window.DynamicMultiInputForTnSearch = DynamicMultiInputForTnSearch;
    
})(window, document);