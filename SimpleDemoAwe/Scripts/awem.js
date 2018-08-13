awem = function ($) {
    var minZindex = 1;
    var maxLookupDropdownHeight = 360;
    var maxDropdownHeight = 420;
    var popSpace = 20;
    var hpSpace = popSpace / 2;
    var reverseDefaultBtns;
    var closePopOnOutClick = 0;
    var $doc = $(document);
    var $win = $(window);

    var keyEnter = 13;
    var keyUp = 38;
    var keyDown = 40;
    var keyEsc = 27;
    var keyTab = 9;
    var keyBackspace = 8;
    var keyShift = 16;

    // keys you can type without opening menu dropdown
    // enter, esc, shift, left arrow, right arrow, tab
    var nonOpenKeys = [keyEnter, keyEsc, keyShift, 37, 39, keyTab]; // keys that won't open the menu

    var updownKeys = [keyUp, keyDown];

    // down and up arrow, enter, esc, shift //, left arrow, right arrow
    var controlKeys = [keyUp, keyDown, keyEnter, keyEsc, keyShift];

    var nonComboSearchKeys = updownKeys.concat(nonOpenKeys);


    var isMobile = function () { return awem.isMobileOrTablet(); };

    var saweload = 'aweload';
    var sawecolschange = 'awecolschanged';
    var saweinit = 'aweinit';
    var sawerowch = 'awerowch';
    var saweinl = 'aweinline';
    var saweinlsave = saweinl + 'save';
    var saweinlinv = saweinl + 'invalid';
    var saweinledit = saweinl + 'edit';
    var saweinlcancel = saweinl + 'cancel';
    var sawerowc = '.awe-row';
    var saweselected = 'awe-selected';
    var saweselectedc = '.' + saweselected;
    var sawechanging = 'awe-changing';
    var sawegridcls = '.awe-grid';
    var sawecontentc = '.awe-content';
    var sddpOutClEv = 'mousedown.ddp keyup.ddp';
    var sfocus = 'focus';
    var smousemove = 'mousemove';
    var soddDocClEv = 'mousedown touchstart keydown';
    var smouseleave = 'mouseleave';
    var sdisabled = 'disabled';
    var sheight = 'height';
    var sminw = 'min-width';
    var se = '';
    var sclick = 'click';
    var schange = 'change';
    var skeyup = 'keyup';
    var skeydown = 'keydown';
    var smodel = 'model';
    var sposition = 'position';
    var snewrow = 'o-glnew';
    var sglrow = 'o-glrow';
    var sglrowc = '.' + sglrow;
    var szindex = 'z-index';
    var sselected = 'selected';
    var sselectedc = '.' + sselected;
    var loadingHtml = rdiv('awe-loading', '<span/>');
    var sclosespan = '<span class="o-cls">&times;</span>';
    var scaret = '<span class="o-slbtn"><i class="o-caret"></i></span>';
    var soldngp = 'o-ldngp';
    var soldngpc = '.' + soldngp;
    var snbsp = '&nbsp;';
    var sstate = 'state';

    var cache = {};
    var dpop = {};

    $(function () {
        if (minZindex == 1) {
            var nav = $('.navbar-fixed-top:first');
            if (nav.length) {
                minZindex = nav.css(szindex);
            }
        }
    });

    function cd() {
        return awem.clientDict;
    }

    function kp(item) {
        return item.k;
    }

    function cp(item) {
        return item.c;
    }

    function which(e) {
        return e.which;
    }

    function istrg(e, sel) {
        return $(e.target).closest(sel).length;
    }

    function format(s, args) {
        return s.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
      ? args[number]
      : match;
        });
    };

    function rbtn(cls, cont, attr) {
        if (attr == null) attr = se;
        return '<button type="button" class="' + cls + '" ' + attr + '>' + cont + '</button>';
    }

    function rdiv(cls, cont, attr) {
        if (cont == null) cont = se;
        if (attr == null) attr = se;
        return '<div class="' + cls + '" ' + attr + '>' + cont + '</div>';
    }

    function toUpperFirst(s) {
        return s.substr(0, 1).toUpperCase() + s.substr(1);
    }

    function toLowerFirst(s) {
        return s.substr(0, 1).toLowerCase() + s.substr(1);
    }

    function containsVal(itemK, vals) {
        for (var i = 0; i < vals.length; i++) {
            if (itemK == escape(vals[i])) {
                return true;
            }
        }

        return false;
    }

    function getIxInArray(val, vals) {
        var res = -1;
        for (var i = 0; i < vals.length; i++) {
            if (val == vals[i]) {
                res = i;
                break;
            }
        }

        return res;
    }

    function contains(key, keys) {
        return $.inArray(key, keys) != -1;
    }

    function strContainsi(c, squeryUp) {
        return (c || se).toString().toUpperCase().indexOf(squeryUp) != -1;
    }

    function strEqualsi(c, squeryUp) {
        return (c || se).toString().toUpperCase() == squeryUp;
    }

    function pickAvEl(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].length) {
                return arr[i];
            }
        }
    }

    function setDisabled(o, s) {
        if (s) {
            o.attr(sdisabled, sdisabled);
        } else {
            o.removeAttr(sdisabled);
        }
    }

    function prevDef(e) {
        e.preventDefault();
    }

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        '"': '&quot;',
        "'": "&#39;",
        ">": "&gt;"
    };

    function escape(str) {
        return String(str).replace(/[&<>"']/g, function (s) {
            return entityMap[s];
        });
    }

    function toStr(v) {
        return (v == null) ? se : v.toString();
    }

    function unesc(str) {
        str = toStr(str);
        for (var key in entityMap) {
            if (entityMap.hasOwnProperty(key)) {
                str = str.split(entityMap[key]).join(key);
            }
        }
        return str;
    }

    function outerh(sel, m) {
        return sel.length ? sel.outerHeight(!!m) : 0;
    }

    function readTag(o, prop, nullVal) {
        var res = nullVal;

        if (o.tag && o.tag[prop] != null) {
            res = o.tag[prop];
        }

        return res;
    }

    function dapi(o) {
        return o.data('api');
    }

    function dto(o) {
        return o.data('o');
    }

    function getZIndex(el) {
        var val = el.css(szindex);
        if (val && val > 0) return val;
        var parent = el.parent();
        return parent && !parent.is($('body')) ? getZIndex(parent) : 0;
    }

    function calcZIndex(zIndex, el) {
        if (zIndex < minZindex) zIndex = minZindex;
        var zi = getZIndex(el);
        if (zi && zi > zIndex) {
            zIndex = zi;
        }

        return zIndex;
    }

    function setGridHeight(grid, newh) {
        var go = dto(grid);
        if (go.h != newh) {
            go.h = newh;
            dapi(grid).lay();
        }
    }

    function scrollTo(focused, cont) {
        function y(o) {
            return o.offset().top;
        }

        var fry = y(focused);
        var fh = focused.height();
        var conh = cont.height();
        var miny = y(cont);
        var maxy = miny + conh - fh;
        var scrcont = cont;
        var winmax = $win.height() + $doc.scrollTop() - fh;
        var winmin = $doc.scrollTop();
        if (maxy > winmax && winmax < fry) {
            maxy = winmax;
            scrcont = $win;
        }
        if (miny < winmin && winmin > fry) {
            miny = winmin;
            scrcont = $win;
        }
        var delta = fry < miny ? fry - miny : fry > maxy ? fry - maxy : 0;
        // +1 for ie and ff 
        if (delta > fh + 1 && scrcont != $win) {
            delta += conh / 2;
        }
        scrcont.scrollTop(scrcont.scrollTop() + delta);
    }

    function initgridh(grid) {
        var o = dto(grid);
        o.h = o.ih;
        dapi(grid).lay();
    }

    function cdelta(grid, val) {
        grid.trigger(sawerowch, val);
    }

    function movedGridRow(fromgrid, togrid) {
        dto(togrid).lrso = 1;
        dto(fromgrid).lrso = 1;
        cdelta(togrid, 1);
        cdelta(fromgrid, -1);
        if (!fromgrid.find(sawerowc).length && dto(fromgrid).lrs.pc > 1) {
            dapi(fromgrid).load();
        }
    }

    function layDropdownPopup2(o, pop, isFixed, capHeight, $opener, setHeight, keepPos, canShrink, chkfulls, minh, popuph, maxph, popup) {

        if (!keepPos) {
            pop.css('left', 0);
            pop.css('top', 0);
        }
        
        var winh = $win.height();
        var winw = $win.width();

        var maxw = winw - popSpace;

        var mnw = Math.min(pop.outerWidth(), maxw);

        pop.css('min-height', se);
        pop.css(sheight, se);
        pop.css('max-width', maxw);
        pop.css(sminw, canShrink ? se : mnw);
        pop.css(sposition, se);

        var scrolltop = $win.scrollTop();
        var toppos;
        var left;

        var topd = scrolltop;

        if ($opener) {
            topd = $opener.offset().top;
            capHeight = capHeight || $opener.outerHeight();
        }

        // handle opener overflow
        var botoverflow = topd - (winh + scrolltop);
        if (botoverflow > 0) {
            topd -= botoverflow;
        }

        var topoverflow = scrolltop - (topd + capHeight);

        if (topoverflow > 0) {
            topd += topoverflow;
        }

        var top = topd - scrolltop;
        var bot = winh - (top + capHeight);

        // adjust height
        var poph = popuph || pop.outerHeight();


        if (!o.maxph) o.maxph = poph;
        else if (o.maxph > poph) poph = o.maxph;
        else o.maxph = poph;

        var autofls = chkfulls(poph);

        var valign = 'bot';
        if (autofls) {
            isFixed = 1;
        } else {
            var stop = top - hpSpace;
            var sbot = bot - hpSpace;
            var maxh = sbot;

            if (minh > poph) minh = poph;

            if (sbot > poph) {
                valign = 'bot';
            }
            else if (stop > sbot) {
                valign = 'top';
                if (poph > stop) {
                    poph = stop;
                }

                maxh = stop;
            } else {
                poph = sbot;
            }

            if (poph < minh) {
                maxh = poph = minh;
            }

            if (maxph && poph > maxph) {
                poph = maxph;
            }

            if (poph > winh - popSpace) {
                maxh = poph = winh - popSpace;
            }

            setHeight(poph, maxh, valign);
        }

        popup && popup.trigger('aweresize');

        if (isFixed) {
            topd = top;
            pop.css(sposition, 'fixed');
        }

        var w = pop.outerWidth(true);
        var h = pop.outerHeight(true);
        if (o.avh) h = o.avh + o.nph;

        if ($opener) {
            left = $opener.offset().left;
            var lspace = winw - (left + w);
            if (lspace < 0) {

                var ow = $opener.outerWidth(true);
                if (ow < w)
                    left -= (w - ow);

                if (left < 10) {
                    left = 10;
                }
            }

            if (autofls) {
                left = toppos = hpSpace;
            }
            else if (bot < h + hpSpace && (top > h + hpSpace || top > (bot))) {
                //top
                toppos = topd - h;

                if (top < h) {
                    toppos = topd - top;
                    if (h + hpSpace < winh) toppos += hpSpace;
                }
            } else {
                //bot
                toppos = topd + capHeight;

                if (bot < h + hpSpace) {

                    toppos -= (h - bot);

                    if (h + hpSpace < winh) toppos -= hpSpace;
                }
            }
        } else {
            var diff = winh - h;
            toppos = diff / 2;
            if (diff > 200) toppos -= 45;

            left = Math.max((winw - pop.outerWidth()) / 2, 0);
        }

        if (!keepPos || autofls) {
            pop.css('left', left);
            pop.css('top', Math.floor(toppos));
        }
    }

    function buttonGroupRadio(o) {
        return nbuttonGroup(o);
    }

    function buttonGroupCheckbox(o) {
        return nbuttonGroup(o, 1);
    }

    function bootstrapDropdown(o) {
        function render() {
            o.d.empty();
            var caption = cd().Select;
            var items = se;
            $.each(o.lrs, function (i, item) {
                var checked = $.inArray(kp(item), awe.val(o.v)) > -1;
                if (checked) caption = cp(item);
                items += '<li role="presentation"><input style="display:none;" type="radio" value="' +
                    kp(item) + '" name="' + o.nm + '" ' + (checked ? 'checked="checked"' : se) +
                    '" /><a role="menuitem" tabindex="-1" href="#" >' + cp(item) + '</a></li>';
            });

            if (!items) items = '<li class="o-empt">(' + cd().Empty + ')</li>';

            var res = rdiv('dropdown', rbtn('btn btn-default dropdown-toggle',
                '<span class="caption">' + caption + '</span> <i class="caret"></i>',
                'data-toggle="dropdown" aria-expanded="true"')
                + '<ul class="dropdown-menu" role="menu">' + items + '</ul>');

            o.d.append(res);
        };

        dapi(o.v).render = render;

        o.v.on(schange, render);

        o.d.on(sclick, 'a', function (e) {
            prevDef(e);
            $(this).prev().click(); // click on the hidden radiobutton
        });
    }

    function nbuttonGroup(o, multiple) {
        var $odisplay;

        function init() {
            $odisplay = o.mo.odisplay;
            o.f.addClass('o-btng');

            $odisplay.on(sclick, '.awe-btn', function () {
                o.api.toggleVal($(this).data('val'));
            });
        }

        function setSelectionDisplay() {
            var val = awe.val(o.v);

            var items = se;
            $.each(o.lrs, function (index, item) {
                var selected = containsVal(kp(item), val) ? saweselected : "";
                items += rbtn('awe-btn awe-il ' + selected, cp(item), 'data-index="' + index + '" data-val="' + kp(item) + '"');
            });

            $odisplay.html(items);
        }

        function setSelectionDisplayChange() {
            var vals = awe.val(o.v);
            $odisplay.children(saweselectedc).removeClass(saweselected);
            $.each(vals, function (i, v) {
                $odisplay.children().filter(function () {
                    return $(this).data('val') == v;
                }).addClass(saweselected);
            });
        }

        var opt = {
            setSel: setSelectionDisplay,
            setSelChange: setSelectionDisplayChange,
            init: init,
            multiple: multiple,
            noMenu: 1
        };

        return odropdown(o, opt);
    }

    function multiselb(o) {
        o.d.addClass("multiselb");
        function renderCaption() {
            return o.mo.inlabel;
        }

        return odropdown(o, {
            multiple: 1,
            renderCaption: renderCaption
        });
    }

    function multiselect(o) {
        var $multi = $(rdiv('o-mltic'));
        var $searchtxt = $('<input type="text" class="o-src awe-il awe-txt" id="' + o.i + '-awed" autocomplete="off"/>');
        var dropmenu;
        var $caption = $('<span class="o-cptn"></span>');
        var glrs;
        var api;
        var comboPref, vprop;
        var isCombo = readTag(o, "Combo");
        var searchOutside = !isMobile() || isCombo;

        o.d.addClass("o-mltsl");
        var reor = readTag(o, "Reor");

        if (searchOutside)
            $multi.append($searchtxt);

        $multi.prepend($caption);

        function init() {
            comboPref = o.mo.cp;
            vprop = o.mo.vprop;
            o.mo.odisplay.append($multi);
            dropmenu = o.mo.dropmenu;

            $caption.html(o.mo.caption);

            if (searchOutside) {
                o.mo.srctxt = $searchtxt;
            }

            api = o.api;
            glrs = api.glrs;
        }

        function handleCaption(hide) {
            if (hide)
                $caption.hide();
            else
                $caption.show();
        }

        function renderSel(vals) {
            //add multiRem for vals
            var items = se;
            var lrs = glrs();
            $.each(vals, function (_, val) {
                var found = 0;
                for (var j = 0; j < lrs.length; j++) {
                    if (lrs[j][vprop] == escape(val)) {
                        items += renderSelectedItem(lrs[j]);
                        found = 1;
                        break;
                    }
                }

                if (!found) {
                    var con = val;

                    if (isCombo && con.match('^' + comboPref)) {
                        con = con.replace(comboPref, se);
                    }

                    items += renderSelectedItem({ k: val, c: escape(con) });
                }
            });

            if (searchOutside) {
                $searchtxt.val(se);
                autoWidth($searchtxt);
                $searchtxt.before(items);
            } else {
                $multi.append(items);
            }

            var count = $multi.find('.o-mlti').length;

            if (!count && searchOutside) {
                $searchtxt.width(0);
            }

            handleCaption(count);
        }

        var setSelectionDisplay = function () {
            $multi.find('.o-mlti').remove();
            renderSel(awe.val(o.v));
        };

        function setSelectionDisplayChange() {
            var vals = awe.val(o.v);

            // remove keys
            $multi.find('.o-mltrem').each(function () {
                var val = $(this).parent().data('val');
                var indexFound = getIxInArray(val, vals);
                if (indexFound > -1) {
                    //remove from vals
                    vals.splice(indexFound, 1);
                } else {
                    $(this).parent().remove();
                }
            });

            renderSel(vals);
        }

        function autoWidth(input) {
            input.css('width', Math.min(Math.max((input.val().length + 2) * 10, 21), $multi.width()) + 'px');
        }

        function renderSelectedItem(item) {
            return rdiv('o-mlti awe-il awe-btn',
                '<span class="o-mltcptn">' + opt.renSelCap(item) + '</span><span class="o-mltrem">&times;</span>',
                'data-val="' + escape(item[vprop]) + '"');
        }

        function postSearchFunc(k) {
            if (!contains(k, nonComboSearchKeys) && searchOutside) {
                if (!dropmenu.find('.o-itm:visible').length) {
                    api.close();
                } else {
                    if (!(!$searchtxt.val() && k == keyBackspace)) {
                        api.open();
                    }
                }
            }
        }

        function addComboVal(val) {
            var itemFound;
            var valu = val.toUpperCase();
            $.each(glrs(), function (i, item) {
                if (strEqualsi(cp(item), valu)) {
                    itemFound = item;
                    val = item[vprop];
                    return false;
                }
            });

            if (!itemFound) val = comboPref + val;

            api.toggleVal(val, 1);
        }

        if (searchOutside) {
            $searchtxt.on(skeyup, function (e) {
                var k = which(e);
                if (!dropmenu.hasClass('open') && !contains(k, nonOpenKeys)) {
                    if (!(k == keyBackspace && !$searchtxt.val())) {
                        api.open();
                    }
                }

                if (isCombo && k == keyEnter) {
                    var stval = $searchtxt.val();
                    stval && addComboVal(stval);
                    $searchtxt.val(se);
                }
            }).on(skeydown, function (e) {
                if (which(e) == keyBackspace && !$searchtxt.val()) {
                    $multi.find('.o-mltrem:last').click();
                }

                if (which(e) == keyEnter) {
                    prevDef(e);
                }

                autoWidth($searchtxt);
            }).on('focusin', function () {
                handleCaption(1);
                autoWidth($(this));
            }).on('focusout', function () {
                $searchtxt.val(se).change();
                if (!$multi.children('.o-mlti').length) {
                    handleCaption();
                    $searchtxt.width(0);
                }
            });
        }

        $multi.on(sclick, function (e) {
            if (!$(e.target).is('.o-mltrem')) {
                api.open();
                searchOutside && $searchtxt.width(1).focus(); // width 1 for focus on mobile 
            }
        });

        $multi.on(sclick, '.o-mltrem', function (e) {
            var it = $(this);
            var val = it.parent().data('val');
            it.attr('awepid', o.i);
            api.toggleVal(unesc(val));
            api.close();
            searchOutside && $searchtxt.focus();
        });

        if (reor) {
            var placeholder, drgObj, others, last;
            var justmoved, initm;
            function wrap(clone, dragObj) {
                initm = 1;
                placeholder = dragObj.clone().addClass(sawechanging + ' placeh').hide();

                drgObj = dragObj.after(placeholder);
                others = $multi.find('.o-mlti:not(.placeh)');
                last = $multi.find('.o-mlti').last();
                return clone;
            }

            function end() {
                placeholder.remove();
                drgObj.show();
            }

            function hoverFunc(dragObj, x, y) {
                if (initm) {
                    drgObj.hide();
                    placeholder.show();
                    initm = 0;
                }
                var hovered;

                others.each(function (_, el) {
                    var mi = $(el);
                    var mix = mi.offset().left;
                    var miy = mi.offset().top;

                    if (x > mix && x < mix + mi.width() &&
                        y > miy && y < miy + mi.height()) {
                        hovered = mi;
                        return false;
                    }
                });

                if (justmoved) {
                    if (!hovered) {
                        justmoved = null;
                    } else if (justmoved.is(hovered)) {
                        hovered = null;
                    }
                }

                if (hovered) {
                    if (hovered.index() < placeholder.index()) {
                        hovered.before(placeholder);
                    } else {
                        hovered.after(placeholder);
                    }

                    justmoved = hovered;
                }
            }

            function dropFunc() {
                placeholder.after(drgObj).remove();
                api.moveVal(drgObj.data('val'), drgObj.prev().data('val'));
                drgObj.show();
            }

            dragAndDrop({
                from: $multi,
                sel: '.o-mlti',
                to: [{ c: $('body'), drop: dropFunc, hover: hoverFunc }],
                wrap: wrap,
                end: end
            });
        }

        var opt = {
            setSel: setSelectionDisplay,
            setSelChange: setSelectionDisplayChange,
            psf: postSearchFunc,
            init: init,
            multiple: 1,
            prerender: function () { },
            afls: !isCombo,
            Combo: isCombo,
            noAutoSearch: searchOutside
        };

        return odropdown(o, opt);
    }

    function colorDropdown(o) {
        var caption;

        function init() {
            caption = o.mo.caption;
        }

        o.d.addClass("o-cldd");

        o.df = function () {
            return $.map(['#5484ED', '#A4BDFC', '#7AE7BF', '#51B749', '#FBD75B', '#FFB878', '#FF887C', '#DC2127', '#DBADFF', '#E1E1E1'],
                function (item) { return { k: item, c: item }; });
        };

        var renderCaption = function (selected) {
            var sel = caption;
            if (selected.length) {
                var color = kp(selected[0]);
                sel = '<div style="background:' + color + '" class="o-color">' + snbsp + '</div>';
            }

            return sel;
        };

        var renderItemDisplay = function (item) {
            return '<span class="o-clitm" style="background:' + kp(item) + '">' + snbsp + '</span>';
        };

        var opt = {
            renderItemDisplay: renderItemDisplay,
            renderCaption: renderCaption,
            noAutoSearch: 1,
            menuClass: "o-clmenu",
            init: init
        };

        odropdown(o, opt);
    }

    function imgDropdown(o) {
        var caption;

        o.d.addClass('o-igdd');

        function init() {
            caption = o.mo.caption;
        }

        var opt = {
            menuClass: "o-igmenu",
            init: init
        };

        opt.renderItemDisplay = function (item) {
            return rdiv('o-igit', '<img src="' + item.url + '"/> ' + cp(item));
        };

        opt.renderCaption = function (selected) {
            var sel = caption;
            if (selected.length)
                sel = '<img src="' + selected[0].url + '"/>' + cp(selected[0]);
            return sel;
        };

        odropdown(o, opt);
    }

    function timepicker(o) {
        o.f.addClass("o-tmp");

        function pad(num) {
            var s = "00" + num;
            return s.substr(s.length - 2);
        }

        o.df = function () {
            var step = readTag(o, "Step") || 30;
            var items = [];
            var ampm = o.tag.AmPm;
            for (var i = 0; i < 24 * 60; i += step) {
                var apindx = 0;
                var hour = Math.floor(i / 60);
                var minute = i % 60;

                if (ampm) {

                    if (hour >= 12) {
                        apindx = 1;
                    }

                    if (!hour) {
                        hour = 12;
                    }

                    if (hour > 12) {
                        hour -= 12;
                    }
                }

                var item = ampm ? hour : pad(hour);

                item += ":" + pad(minute);

                if (ampm) item += " " + ampm[apindx];

                items.push(item);
            }

            return $.map(items, function (v) { return { k: v, c: v }; });
        };

        return combobox(o);
    }

    function combobox(o) {
        o.d.addClass('combobox');

        var $v = o.v;
        var cmbtxt = $('<input type="text" class="awe-txt o-cbxt o-src" size="1" autocomplete="off" id="' + o.i + '-awed" />');
        var $openbtn = $(rbtn('o-cbxbtn o-ddbtn awe-btn', scaret, 'tabindex="-1"'));
        var docClickRegistered = 0;
        var glrs;
        var closeOnEmpty = readTag(o, "CloseOnEmpty");
        var api;
        var dropmenu;
        var vprop;
        var contval = se;

        function init() {
            o.mo.odisplay.append(cmbtxt).append($openbtn);
            o.mo.srctxt = cmbtxt;
            vprop = o.mo.vprop;
            cmbtxt.attr('placeholder', o.mo.caption);
            api = o.api;
            glrs = api.glrs;
            dropmenu = o.mo.dropmenu;
        }

        function setSelectionDisplay() {
            var vals = awe.val($v);

            var selected = $.grep(glrs(), function (item) {
                return containsVal(item[vprop], vals);
            });

            var txtval = se;
            if (!selected.length && vals.length) {
                txtval = vals[0];
            }
            else if (selected.length) {
                txtval = unesc(cp(selected[0]));
            }

            cmbtxt.val(txtval);
        }

        function docClickFocusHandler(e) {
            var $target = $(e.target);
            if (!$target.closest(dropmenu).length && !$target.closest(o.d).length) {
                
                compval();
                checkComboval();
                docClickRegistered = 0;
                $doc.off('click focusin', docClickFocusHandler);
            }
        }

        cmbtxt.on('focusin', function () {
            this.selectionStart = this.selectionEnd = this.value.length;

            if (!docClickRegistered) {
                $doc.on('click focusin', docClickFocusHandler);
                docClickRegistered++;
            }
        }).on(skeydown, function (e) {
            if (which(e) == keyEnter && !dropmenu.hasClass('open')) {
                prevDef(e);
                checkComboval();
            }
        }).on(skeyup, function (e) {
            var val = cmbtxt.val();
            var isOpen = dropmenu.hasClass('open');
            var key = which(e);
            
            if (closeOnEmpty && !val && !contains(key, updownKeys)) {
                if (isOpen) {
                    api.close();
                }
            }
            else if (!isOpen) {
                if (!contains(key, nonOpenKeys)) {
                    api.toggleOpen();
                }

                if (key == keyEnter) {
                    checkComboval();
                }
            }
        });

        function postSearchFunc(k) {
            if (!contains(k, nonComboSearchKeys)) {
                if (!dropmenu.find('.o-itm:visible').length) {
                    api.close();
                }

                compval();
            }
        }

        $openbtn.on(sclick, function () {
            api.search(se);
            if (!isMobile())
                cmbtxt.focus();
        });

        function compval() {
            var query = cmbtxt.val();
            var newVal = query;
            var cval = query;
            var indexFound;
            var found;

            query = query.toUpperCase();

            var items = glrs();
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                if (strEqualsi(cp(item), query)) {
                    indexFound = i;
                    found = 1;
                    newVal = item[vprop];
                    cval = cp(item);
                    break;
                }
            }

            dropmenu.find(sselectedc).removeClass(sselected);

            if (found) {
                dropmenu.find('.o-ditm').eq(indexFound).addClass(sselected);
            }

            $v.data('comboval', newVal);
            contval = cval;
        }

        function checkComboval() {
            if (!$v.parent().length) {
                return;
            }

            var comboval = $v.data('comboval');

            if (comboval != null) {
                if (o.v.val() != comboval) {
                    api.toggleVal(comboval);
                    cmbtxt.val(contval);
                }
            }
        }

        odropdown(o, {
            noAutoSearch: 1,
            setSel: setSelectionDisplay,
            setSelChange: setSelectionDisplay,
            Combo: 1,
            init: init,
            psf: postSearchFunc,
            prerender: function () { },
            afls: 0
        });
    }

    function menuDropdown(o) {
        o.d.addClass("menudd");
        var opt = {
            menuClass: "menuddmenu"
        };

        opt.renderCaption = function () {
            return o.mo.caption;
        };

        opt.renItAttr = opt.renItAttr || function (i, it) {
            var res = ' data-index="' + i + '" ';
            if (it.click) res += ' data-click="' + it.click + '"';
            return res;
        }

        opt.renderItemDisplay = opt.renderItemDisplay || function (item) {
            var res;
            var href = kp(item) || item.href;
            if (href && !item.click) {
                res = '<a href="' + href + '">' + cp(item) + '</a>';
            } else {
                res = cp(item);
            }

            return res;
        };

        opt.onItemClick = function (zev) {
            var $trg = $(zev.target);
            if ($trg.is('.o-itm')) {
                var click = $trg.data(sclick);

                if (click) {
                    eval(click);
                } else {
                    var $a = $trg.find('a');
                    if ($a.length)
                        $a.get(0).click();
                }
            }

            o.api.close();
        };

        opt.noAutoSearch = 1;

        return odropdown(o, opt);
    }

    function odropdown(o, opt) {
        var srcThresh = 10;
        var api = o.api;
        api.render = render;
        api.glrs = glrs;
        api.toggleVal = toggleVal;
        api.moveVal = moveVal;

        opt = opt || {};
        if (opt.afls == null) opt.afls = 1;

        var btnCaption = $(rdiv('o-cptn'));
        var btn = $(rbtn('o-ddbtn awe-btn"', scaret, 'id="' + o.i + '-awed"'));
        var srcinfo = '<li class="o-info">' + cd().SearchForRes + '</li>';

        var $odropdown = $(rdiv('o-dd'));
        var $odisplay = $(rdiv('o-disp ' + soldngp, loadingHtml));

        var inlabel = readTag(o, 'InLabel', se);
        var caption = readTag(o, 'Caption', cd().Select);
        var autoSelectFirst = readTag(o, 'AutoSelectFirst');
        var noSelClose = readTag(o, 'NoSelClose');
        var minWidth = readTag(o, 'MinWidth');
        var searchFunc = readTag(o, 'SrcFunc');
        var cacheKey = readTag(o, 'Key', o.i);
        var itemFunc = readTag(o, 'ItemFunc');
        var captionFunc = readTag(o, 'CaptionFunc');
        var useConVal = readTag(o, 'UseConVal');
        var popupClass = readTag(o, "Pc", se);
        var comboPref = readTag(o, 'GenKey') ? '__combo:' : se;
        var openOnHover = readTag(o, "Ohover");
        var asmi = readTag(o, "Asmi");
        var showCmbItm = readTag(o, "CmbItm", 1);

        var vprop = useConVal ? 'c' : 'k';

        var valInputType = opt.multiple ? "checkbox" : "radio";

        var $valCont = $(rdiv('valCont')).hide();

        var hostc = $('body');
        var attr = 'tabindex="-1" data-i="' + o.i + '"';
        var modal = $(rdiv('o-pmodal o-pu', se, attr));
        var $dropmenu = $(rdiv('o-menu o-pu ' + popupClass + ' ' + (opt.menuClass || se), se, attr));

        if (o.rtl) $dropmenu.css('direction', 'rtl');
        if (minWidth) $odropdown.css(sminw, minWidth);

        var $menuSearchCont = $(rdiv('o-srcc ' + soldngp, '<input type="text" class="o-src awe-txt" placeholder="' + cd().Searchp + '" size="1"/>' + loadingHtml));
        var $menuSearchTxt = $menuSearchCont.find('.o-src');
        var $itemscont = $(rdiv('o-itsc'));
        var $menu = $('<ul class="o-mnits" tabindex="-1">' + (searchFunc ? srcinfo : se) + '</ul>');
        var slistctrl = slist($itemscont, { sel: '.o-itm', afs: '.o-ditm' });
        var autofocus = slistctrl.autofocus;

        var isCombo = opt.Combo;
        var isFixed = 0;
        var zIndex = minZindex;

        if (isMobile())
            $dropmenu.addClass('o-mobl');

        $odropdown.append($odisplay);
        $dropmenu.append($menuSearchCont);
        $dropmenu.append($itemscont);
        $itemscont.append($menu);

        o.d.append($valCont).append($odropdown);
        o.f.addClass('o-field');

        o.mo = { dropmenu: $dropmenu, odisplay: $odisplay, caption: caption, odropdown: $odropdown, inlabel: inlabel, vprop: vprop, cp: comboPref };

        opt.renderItemDisplay = opt.renderItemDisplay || function (item) {
            return itemFunc ? eval(itemFunc)(item) : cp(item);
        };

        opt.renderCaption = opt.renderCaption || function (selected) {
            var sel = caption;
            if (selected.length) {
                sel = opt.renSelCap(selected[0]);
            }

            return inlabel + sel;
        };

        opt.renSelCap = opt.renSelCap || function (item) {
            return captionFunc ? eval(captionFunc)(item) : cp(item);
        }

        opt.setSel = opt.setSel || function () {
            btnCaption.html(getSelectedCaption());
        };

        opt.setSelChange = opt.setSelChange || function () {
            btnCaption.html(getSelectedCaption());
        };

        opt.renItAttr = opt.renItAttr || function (i, it) {
            return 'data-index="' + i + '" data-val="' + it[vprop] + '"';
        }

        function renderItems(rs) {
            var res = se;

            if (isCombo) {
                res += '<li class="o-itm o-cmbi" style="display:none;"></li>';
            }

            for (var i = 0; i < rs.length; i++) {
                var item = rs[i];
                res += '<li class="o-itm o-ditm" ' + opt.renItAttr(i, item) + '>' + opt.renderItemDisplay(item) + '</li>';
            }

            if (!rs.length) {
                res += '<li class="o-empt">(' + cd().Empty + ')</li>';
            }

            if (searchFunc) {
                res += srcinfo;
            }

            return res;
        };

        function getSelectedCaption() {
            var vals = awe.val(o.v);
            var selected = $.grep(glrs(), function (item) {
                return containsVal(kp(item), vals);
            });

            return opt.renderCaption(selected);
        }

        opt.onItemClick = opt.onItemClick || function () {

            var $clickedItem = $(this);
            var val = $clickedItem.data('val');

            toggleVal(val);

            var $osearch = $odisplay.find('.o-src');

            if ($osearch.length && !isMobile()) {
                $osearch.focus();
            } else {
                $odisplay.find('.o-ddbtn').focus();
            }

            if (!noSelClose) {
                close();
            }

            $menuSearchTxt.val(se);
            filter(se, $clickedItem);

            if (noSelClose) {
                lay();
            }
        };

        opt.prerender = opt.prerender || function () {
            btn.append(btnCaption);
            $odisplay.append(btn);
        };

        // get last result + cache
        function glrs() {
            var cacheObj = cache[cacheKey];
            if (cacheObj) {
                var res = cacheObj.Items.slice(0);

                for (var i = 0; i < o.lrs.length; i++) {
                    if (cacheObj.Keys[kp(o.lrs[i])] == null) {
                        res.push(o.lrs[i]);
                    }
                }

                return res;
            }

            return o.lrs;
        }

        function findvalinput(val) {
            return $valCont.find('input').filter(function () {
                return $(this).val() == val;
            });
        }

        function toggleVal(val, combov) {
            var valinput = findvalinput(val);

            if (valinput.length) {
                if (opt.multiple) {
                    if (!combov) {
                        valinput.click().remove();
                    }
                } else if (isCombo) {
                    changeHandler();
                }
            } else {

                if (!opt.multiple) {
                    $valCont.empty();
                }

                valinput = $('<input type="' + valInputType + '" value="' + escape(val) + '" name="' + o.nm + '"/>');
                $valCont.append(valinput);
                valinput.click();
            }
        }

        function moveVal(val, afval) {
            var input = findvalinput(val);

            if (afval) {
                findvalinput(afval).after(input);
            } else {
                $valCont.prepend(input);
            }
        }

        function render() {
            opt.setSel();

            if ((glrs().length > srcThresh || searchFunc) && !opt.noAutoSearch) {
                $menuSearchCont.show();
            } else {
                $menuSearchCont.hide();
            }

            renderValContAndMenu();
        };

        function renderValContAndMenu() {
            $valCont.html(renderValInputs());

            if (!opt.noMenu) {
                $menu.html(renderItems(glrs()));
                markMenuSelectedItems();
            }
        }

        function renderValInputs() {
            var res = se;
            var rawvals = awe.val(o.v);

            var vals = [];

            var lrs = glrs();
            for (var i = 0; i < rawvals.length; i++) {
                var val = escape(rawvals[i]);
                var found = 0;
                for (var j = 0; j < lrs.length; j++) {
                    if (val == lrs[j][vprop]) {
                        vals.push(lrs[j][vprop]);
                        found = 1;
                        break;
                    }
                }

                if (isCombo && !found && val && (val.match("^" + comboPref) || !opt.multiple)) {
                    vals.push(val);
                }
            }

            if (autoSelectFirst && (!vals.length || vals.length == 1 && vals[0] == se)) {

                var allItems = glrs();
                if (allItems.length) {
                    vals = [allItems[0][vprop]];
                }
            }

            $.each(vals, function (_, value) {
                res += '<input type="' + valInputType + '" value="' + value + '" name="' + o.nm + '" checked="checked"/>';
            });

            if (!vals.length && opt.multiple) res = '<input type="checkbox" name="' + o.nm + '" />';

            return res;
        }

        function markMenuSelectedItems() {
            var val = awe.val(o.v);
            var items = glrs();
            $dropmenu.find('.o-ditm').each(function (i, element) {
                var checked = containsVal(items[i][vprop], val);
                if (checked) {
                    $(element).addClass(sselected);
                } else {
                    $(element).removeClass(sselected);
                }
            });
        }

        function filter(query, clickedItem) {

            var items = glrs();
            if (searchFunc) {
                var info = $itemscont.find('.o-info');
                if (query) {
                    info.hide();
                } else {
                    info.show();
                }
            }

            var squery = query.toUpperCase();

            var count = 0;
            var f = function (s) { return s; }
            if (squery != escape(squery)) {
                f = unesc;
            }

            var cmbi;
            if (isCombo && showCmbItm) {
                var ec = escape(query);
                cmbi = $($dropmenu.find('.o-cmbi'));
                cmbi.html(opt.renderItemDisplay({ c: ec, k: ec })).data('val', comboPref + query);
            }

            var oitems = $dropmenu.find('.o-ditm').get();

            var matchFound = 0;
            for (var i = 0; i < oitems.length; i++) {
                var el = $(oitems[i]);

                var cont = f(cp(items[i]));

                if (strContainsi(cont, squery)) {
                    if (isCombo && cont.length == query.length) {
                        matchFound = 1;
                    }

                    el.show();
                    count++;
                }
                else {
                    el.hide();
                }
            }

            if (isCombo && showCmbItm) {
                if (matchFound || !query) {
                    cmbi.hide();
                } else {
                    cmbi.show();
                }
            }

            if (clickedItem && !clickedItem.is(':visible')) {
                clickedItem = null;
            }
            
            autofocus(clickedItem);

            return count;
        }

        function docClickHandler(e) {
            if ($(e.target).is('.o-pmodal') && e.type == 'touchstart') return;

            if (!istrg(e, $odisplay) &&
                !istrg(e, $dropmenu)) {
                close();
            }
        };

        function close() {
            if (isDropmenuOpen()) toggleOpen();
        }

        function open() {
            if (!isDropmenuOpen()) toggleOpen();
        }

        function isDropmenuOpen() {
            return $dropmenu.hasClass('open');
        }

        function toggleOpen() {
            $dropmenu.toggleClass('open');
            if (isDropmenuOpen()) {
                $odisplay.find('.o-ddbtn').addClass('awe-focus');
                o.maxph = 0;
                if (zIndex) {
                    zIndex = calcZIndex(zIndex, $odropdown);

                    modal.css(szindex, zIndex + 1);
                    $dropmenu.css(szindex, zIndex + 1);
                }

                $dropmenu.css(sminw, $odisplay.width() + 'px');
                $doc.on(soddDocClEv, docClickHandler);

                // render for searchfunc cache merging
                if (cache[cacheKey]) {
                    renderValContAndMenu();
                }

                $dropmenu.show();
                lay();

                if (!(opt.noAutoSearch || isMobile())) {
                    $menuSearchTxt.focus();
                }

                autofocus();
                dpop[o.i] = $odropdown;
            } else {
                $odisplay.find('.o-ddbtn').removeClass('awe-focus');
                $dropmenu.hide();
                modal.hide();
                $doc.off(soddDocClEv, docClickHandler);

                $menuSearchTxt.val(se);

                filter(se);
            }
        }

        function setOpenOnHover() {
            var waitingToClose;
            var waitingToOpen;

            function cancelClose() {
                if (waitingToClose) {
                    clearTimeout(waitingToClose);
                    waitingToClose = null;
                }
            }

            var smousemoveleave = smousemove + ' ' + smouseleave;

            $dropmenu.on(smousemove, cancelClose);

            $odropdown.on(smousemove,
                function () {
                    cancelClose();

                    if (!isDropmenuOpen()) {
                        if (waitingToOpen) return;
                        
                        function onMoveLeave(e) {
                            if (e.type == smouseleave || !istrg(e, $odropdown)) {
                                clearTimeout(waitingToOpen);
                                waitingToOpen = null;
                                $doc.off(smousemoveleave, onMoveLeave);
                            }
                        }

                        $doc.on(smousemoveleave, onMoveLeave);

                        waitingToOpen = setTimeout(function () {
                            waitingToOpen && hoverOpen();
                            waitingToOpen = null;
                            $doc.off(smousemoveleave, onMoveLeave);
                        }, 150);
                    }
                });

            function hoverOpen() {
                open();

                $doc.on(smousemoveleave, docMove);

                function docMove(e) {
                    if ((e.type == smouseleave || !(istrg(e, $odropdown) || istrg(e, $dropmenu))) && !waitingToClose) {
                        waitingToClose = setTimeout(function () {
                            $doc.off(smousemoveleave, docMove);
                            close();
                            waitingToClose = null;
                        }, 250);
                    }
                }
            }
        }

        function lay() {
            if ($dropmenu.hasClass('open')) {
                var oitemsc = $dropmenu.find('.o-itsc');
                var oitemscst = oitemsc.scrollTop();

                oitemsc.css('max-height', se);
                oitemsc.css(sheight, se);
                $dropmenu.css('width', se);

                function chkfulls(height) {
                    var winw = $win.width();
                    var winh = $win.height();
                    var limh = 300;
                    var limw = 200;
                    if (!isCombo && opt.afls) {
                        if (height > winh - limh - popSpace && $dropmenu.width() > winw - limw - popSpace) {
                            $dropmenu.width(winw - popSpace);
                            setHeight(winh - popSpace, winh - popSpace - 25); // extra for clickout

                            modal.show();
                            return 1;
                        } else {
                            modal.hide();
                        }
                    }
                }

                function setHeight(poph, maxh, valign) {
                    var rest = $dropmenu.outerHeight() - oitemsc.height();

                    if (valign == 'top') {
                        oitemsc.css(sheight, poph - rest);
                    } else {
                        oitemsc.css('max-height', Math.min(maxh - rest, maxDropdownHeight));
                    }
                }

                var opener = o.d.find('.o-ddbtn');
                if (!opener.length || isCombo) opener = o.d;

                layDropdownPopup2(o, $dropmenu, isFixed, null, opener, setHeight, 0, 0, chkfulls, 70, 0, maxDropdownHeight);

                oitemsc.scrollTop(oitemscst);
            }
        }

        opt.init && opt.init();

        if (asmi != null) {
            opt.noAutoSearch = asmi == -1 ? 1 : 0;
            srcThresh = asmi;
        }

        var srctxt = o.mo.srctxt || $menuSearchTxt;

        opt.prerender();
        render();

        if (!opt.noMenu) {
            var uidialog = o.d.closest('.awe-uidialog');
            var parPop = o.d.closest('.o-pmc');

            var id = o.i + '-dropmenu';
            $('#' + id).remove();
            $('#' + id + '-modal').remove();
            $dropmenu.attr('id', id);
            modal.attr('id', id + '-modal');

            isFixed = 1;
            if (uidialog.length) {
                hostc = uidialog;
                zIndex = hostc.css(szindex);
            } else if (o.d.parents('.modal-dialog').length) {
                hostc = o.d.closest('.modal');
                zIndex = hostc.css(szindex);
            } else if (parPop.length) {
                zIndex = parPop.css(szindex);
                if (parPop.css(sposition) != 'fixed') {
                    isFixed = 0;
                }
            } else {
                isFixed = 0;
            }

            hostc.append(modal.hide());
            hostc.append($dropmenu);

            $dropmenu.on(sclick, '.o-itm', opt.onItemClick)
                     .on(smousemove, '.o-itm', function () { slistctrl.focus($(this)); });

            $odropdown.on(sclick, '.o-ddbtn', function () {
                if (openOnHover) open();
                else
                    toggleOpen();
            });

            $odisplay.on(skeydown, function (e) {
                if (isDropmenuOpen()) {
                    handleMoveSelectKeys(e);
                }
            });

            $dropmenu.on(skeydown, handleMoveSelectKeys);

            function loadHandler() {
                if (cache[cacheKey]) {
                    cache[cacheKey] = { Items: [], Keys: {} };
                    renderValContAndMenu();
                }
            }

            o.v.on(saweload, loadHandler);

            function handleMoveSelectKeys(e) {
                slistctrl.keyh(e);

                if (which(e) == keyEsc) {
                    $(e.target).closest('.awe-popup').data('esc', 1);
                    close();
                }
            }

            var searchTimerOn;
            var searchTimerTerm;
            var searchTimer;
            var localSearchResCount;
            var itrkc = 0;

            function getSrcTerm() {
                return srctxt.val().trim();
            }

            srctxt.on(skeyup, function (e) {
                if (!contains(which(e), nonComboSearchKeys)) {

                    var term = getSrcTerm();
                    localSearchResCount = filter(term);

                    if (searchFunc && term) {
                        // cache can be already set by another odropdown
                        cache[cacheKey] = cache[cacheKey] || { Items: [], Keys: {} };

                        if (searchTimerOn) {
                            itrkc++;
                        }

                        if (!searchTimerOn) {
                            searchTimerOn = 1;
                            searchTimerTerm = term;

                            searchTimer = setInterval(function () {
                                var newTerm = getSrcTerm();

                                if (newTerm == searchTimerTerm && !itrkc) {
                                    clearInterval(searchTimer);
                                    searchTimerOn = 0;

                                    if (searchTimerTerm) {
                                        srctxt.closest(soldngpc).addClass('o-ldng');

                                        $.when(eval(searchFunc)(o, { term: searchTimerTerm, count: localSearchResCount, cache: cache[cacheKey] }))
                                            .always(function () {
                                                srctxt.closest(soldngpc).removeClass('o-ldng');
                                            })
                                            .done(function (result) {
                                                if (result.length) {
                                                    $.each(result, function (i, item) {
                                                        var cacheObj = cache[cacheKey];
                                                        var keys = cacheObj.Keys;
                                                        var items = cacheObj.Items;
                                                        if (keys[kp(item)] == null) {
                                                            keys[kp(item)] = items.length;
                                                            items.push(item);
                                                        } else {
                                                            items[keys[kp(item)]] = item;
                                                        }
                                                    });

                                                    renderValContAndMenu();
                                                    filter(getSrcTerm());
                                                    lay();
                                                }

                                                opt.psf && opt.psf(which(e));
                                            });
                                    }
                                }

                                searchTimerTerm = newTerm;
                                itrkc = 0;

                            }, 250);
                        }
                    } else {
                        opt.psf && opt.psf(which(e));
                    }
                }
            });

            $dropmenu.on(skeydown, function (e) {
                if (which(e) == keyTab) {
                    prevDef(e);
                    $odropdown.find(':tabbable').focus();
                }
            });

            api.toggleOpen = toggleOpen;
            api.layMenu = lay;
            api.search = filter;
            api.close = close;
            api.open = open;

            if (openOnHover) setOpenOnHover();
        }

        function changeHandler() {
            opt.setSelChange();
            markMenuSelectedItems();
            o.v.data('comboval', null);
        }

        o.v.on(schange, changeHandler);

        $win.on('resize domlay', function () {
            lay();
        });
    }

    function slist(cont, opt) {
        var itemsel = opt.sel;
        var onenter = opt.enter;
        var focuscls = opt.fcls || sfocus;
        var selcls = opt.sc || sselected;
        var itemselector = itemsel + ':visible:first';
        var afs = opt.afs;
        if (afs) afs += ':visible:first';

        function focus(item) {
            remFocus();
            item.addClass(focuscls);
        }

        function remFocus() {
            cont.find('.' + focuscls).removeClass(focuscls);
        }

        function scrollToFocused() {
            var focused = cont.find('.' + focuscls);

            if (focused.length && focused.is(':visible')) {
                function y(o) {
                    return o.offset().top;
                }

                var fry = y(focused);
                var fh = focused.height();
                var conh = cont.height();
                var miny = y(cont);

                var maxy = miny + conh - fh;

                var scrcont = cont;

                var winmax = $win.height() + $doc.scrollTop() - fh;
                var winmin = $doc.scrollTop();

                if (maxy > winmax && winmax < fry) {
                    maxy = winmax;
                    scrcont = $win;
                }

                if (miny < winmin && winmin > fry) {
                    miny = winmin;
                    scrcont = $win;
                }

                var delta = fry < miny ? fry - miny : fry > maxy ? fry - maxy : 0;

                // +1 for ie and ff 
                if (delta > fh + 1 && scrcont != $win) {
                    delta += conh / 2;
                }

                scrcont.scrollTop(scrcont.scrollTop() + delta);
            }
        }

        function autofocus($itemToFocus) {
            if ($itemToFocus) {
                focus($itemToFocus);
            } else {
                var $selected = cont.find('.' + selcls + ':visible');
                if ($selected.length == 1) {
                    focus($selected);
                } else {
                    if (afs && cont.find(afs).length) {
                        focus(cont.find(afs));
                    } else {
                        focus(cont.find(itemselector));
                    }
                }
            }

            scrollToFocused();
        }

        function handleMoveSelectKeys(e) {
            var key = which(e);

            var focused = cont.find('.' + focuscls);

            var select = function (item, f) {
                if (!focused.length) {
                    autofocus();
                }
                else if (item.length) {
                    focus(item);
                    scrollToFocused();
                } else if (f) {
                    f();
                }
            };

            if (contains(key, controlKeys)) {
                if (key == keyDown) {
                    prevDef(e);
                    var $next = focused.nextAll(itemselector);
                    select($next, opt.botf);
                } else if (key == keyUp) {
                    prevDef(e);
                    var $prev = focused.prevAll(itemselector);
                    select($prev, opt.topf);
                } else if (key == keyEnter) {
                    if (onenter) {
                        onenter(e, focused);
                    }
                    else {
                        prevDef(e);
                        focused.click();
                    }
                }

                return 1;
            }

            return 0;
        }

        return {
            focus: focus,
            scrollToFocused: scrollToFocused,
            keyh: handleMoveSelectKeys,
            autofocus: autofocus,
            remf: remFocus
        };
    }

    function notif(text, time, clss) {
        var notifCont = $('#o-notifcont');

        if (!notifCont.length) {
            notifCont = $(rdiv('o-ntpc', se, 'id="o-notifcont"'));
            notifCont.appendTo($('body'));
        }

        var $popup = $(rdiv('o-ntp')).addClass(clss);
        var $content = $(rdiv('o-ntc')).html(text || 'error occured');
        var $closeBtn = $(sclosespan);


        notifCont.prepend($popup);
        $popup.append($content);
        $popup.append($closeBtn);
        $popup.append(rdiv('o-ntlb'));

        $closeBtn.on(sclick, close);

        $content.css('max-height', $win.height() - 50);

        if (time) {
            setTimeout(function () {
                close(1);
            }, time);
        }

        function close(fade) {
            if (fade == 1) {
                $popup.fadeOut(function () { $popup.remove(); });
            } else {
                $popup.remove();
            }
        }
    }

    function dropdownPopup(o) {
        var p = o.p; //opup properties
        var popup = p.d; //popup div
        p.i = p.i || se;

        var wrap = $(rdiv('o-pwrap', rdiv('o-pmc o-pu', se, 'tabindex="-1" data-i="' + p.i + '"'))).hide();

        var itmoved;
        var header;
        var api = function () { };
        var $opener;
        var openerId;

        var fls;

        var outsideClickClose = readTag(o, "Occ");
        var isDropDown = readTag(o, "Dd", !!o.api);
        var showHeader = readTag(o, "Sh");
        var toggle = readTag(o, "Tg");

        if (!isDropDown) showHeader = 1;

        var sopener = o.opener;
        var $dropdownPopup = wrap.find('.o-pmc').addClass(p.pc);
        p.mlh = 0;

        popup.addClass('o-pc');

        if (p.minw != null) {
            popup.css(sminw, p.minw);
        }

        if (o.rtl) {
            $dropdownPopup.addClass('awe-rtl').css('direction', 'rtl');
        }

        $dropdownPopup.append(popup);

        var modal = $(rdiv('o-pmodal o-pu', se, 'tabindex="-1" data-i="' + p.i + '"'));
        modal.on(skeyup, closeOnEsc);

        $dropdownPopup.on(skeydown,
            function (e) {
                if (e.keyCode == keyTab) {
                    var tabbables = $dropdownPopup.find(':tabbable'),
                        first = tabbables.first(),
                        last = tabbables.last();
                    var trg = $(e.target);
                    if (trg.is(last) && !e.shiftKey) {
                        first.focus();
                        return false;
                    } else if (trg.is(first) && e.shiftKey) {
                        last.focus();
                        return false;
                    }
                }
            });

        var isFixed;
        var zIndex = minZindex;

        function layPopup(isResize, canShrink) {
            
            if (isResize) {
                // reset position changed by dragging popup
                itmoved = 0;
            }

            if (!p.isOpen) return;

            var winavh = $win.height() - popSpace;
            var winavw = $win.width() - popSpace;

            modal.css(szindex, zIndex);
            $dropdownPopup.css('overflow-y', 'auto');
            if (zIndex) {
                $dropdownPopup.css(szindex, zIndex);
            }

            popup.css('width', se);
            popup.css(sheight, se);
            popup.css('max-height', se);

            var oapi = o.api || {};

            if (oapi.rlay) {
                oapi.rlay();
            }

            var capHeight = o.f ? outerh(o.f.find('.awe-openbtn:first'), 1) : 0;

            fls = p.f;

            if (openerId && !$opener.closest(document).length) {
                $opener = $('#' + openerId);
            }

            var height = p.dh || p.h;

            if (!height) {
                height = Math.max(350, outerh($dropdownPopup));
            }

            var maxph = 0;

            var dpw = $dropdownPopup.outerWidth();
            var pow = popup.outerWidth();

            var nonpopw = dpw - pow;

            var resth = $dropdownPopup.outerHeight() - popup.outerHeight();

            if (oapi.lay) {
                height = p.dh || maxLookupDropdownHeight;
                maxph = p.dh || maxLookupDropdownHeight;
            }

            var limw = winavw;
            if (p.mw) {
                popup.css('max-width', p.mw);
                limw = p.mw;
            }

            if (p.w) {
                if (!isDropDown || p.wws) {
                    var minw = Math.min(p.w, Math.min(limw, winavw)) - nonpopw;
                    popup.css(sminw, minw);
                }
            }

            var minh = height;
            if (!isDropDown || p.hws) {
                if (p.h) {
                    minh = p.h;
                    if (height < minh) height = minh;
                    if (maxph < minh) maxph = minh;
                    popup.css('min-height', Math.min(p.h, winavh) - resth);
                }
            }

            function chkfulls(ph) {
                var pw = $dropdownPopup.outerWidth();
                var h = $dropdownPopup.outerHeight();

                var wlim = 25, hlim = 200;

                if (p.af) {
                    wlim = 200;
                    hlim = 300;

                    h = Math.max(ph, h);
                };

                var condition = pw > winavw - wlim && h > winavh - hlim;

                if (!oapi.lay) {
                    condition = condition && h * .7 > winavh - h;
                }

                if (condition) {
                    fls = 1;
                }

                if (fls) {
                    if (oapi.lay) {
                        o.avh = winavh - resth;
                        o.nph = resth;
                    }

                    popup.css('width', winavw - nonpopw);
                    popup.css(sheight, winavh - resth);
                }

                if (fls || p.m) {
                    modal.show();
                } else {
                    modal.hide();
                }

                return fls;
            }

            function setmaxheight(poph, maxh, valign) {
                var avh = maxh - resth;
                popup.css('max-height', avh);

                if (oapi.lay) {
                    avh = poph - resth;

                    popup.css(sheight, avh);

                    o.avh = avh;
                    o.nph = resth;
                }
            }

            layDropdownPopup2(o,
                $dropdownPopup,
                isFixed,
                capHeight,
                isDropDown ? $opener : null,
                setmaxheight,
                itmoved,
                canShrink,
                chkfulls,
                minh,
                height,
                maxph,
                popup);

            popup.trigger('awepos');
        }

        function outClickClose(e) {
            var shouldClose;
            if (outsideClickClose != null) {
                shouldClose = outsideClickClose;
            } else {
                shouldClose = closePopOnOutClick || $opener && isDropDown;
            }

            if (shouldClose) {
                var trg = $(e.target);

                function lookForMe(it) {
                    var popup = it.closest('.o-pu');

                    var pid, mclick = 0;
                    if (it.is('.o-pmodal')) {
                        mclick = 1;
                    }

                    if (popup.length) {
                        pid = popup.data('i');
                    }

                    if (pid) {
                        if (pid == p.i && !mclick) return 1;

                        var popener = dpop[pid];
                        if (popener)
                            return lookForMe(popener);
                    }
                }

                if (!lookForMe(trg)) {
                    if (!trg.closest($opener).length) {
                        var $omenu = trg.closest('.o-menu');
                        if ($omenu.length) {
                            if (!$omenu.data('owner').closest($dropdownPopup).length) {
                                api.close(1);
                            }
                        } else {
                            if (!trg.closest('.ui-datepicker').length) {
                                api.close(1);
                            }
                        }
                    }
                }
            } else {
                $doc.off(sddpOutClEv, outClickClose);
            }
        }

        function loadHandler() {
            layPopup();
        }

        $dropdownPopup.on('aweload awebeginload', loadHandler);

        function resizeHandler() {
            layPopup(1, 1);
        }

        $win.on('resize domlay', resizeHandler);

        api.lay = resizeHandler;

        api.open = function (e) {
            if (toggle) {
                if (p.isOpen) {
                    return api.close();
                }
            }

            if (sopener) {
                $opener = sopener;
            } else {
                if (e && e.target) {
                    $opener = $(e.target);
                    var btn = $opener.closest('button');
                    if (btn.length) $opener = btn;
                }

                if (o.f && o.f.closest('.awe-field').length) {
                    $opener = o.f;
                }

                if ($opener && !$opener.is(':visible')) {//|| p.f
                    $opener = null;
                }
            }

            var hostc = $('body');
            isFixed = 1;
            if ($opener) {
                openerId = $opener.attr('id');
                var uidialog = $opener.closest('.awe-uidialog');
                var parPop = $opener.closest('.o-pmc');

                if (uidialog.length) {
                    hostc = uidialog;
                    zIndex = hostc.css(szindex);
                } else if ($opener.parents('.modal-dialog').length) {
                    hostc = $opener.closest('.modal');
                    zIndex = hostc.css(szindex);
                } else if (parPop.length) {
                    zIndex = parPop.css(szindex);
                } else {
                    isFixed = 0;
                    zIndex = calcZIndex(zIndex, $opener);
                }

                header.hide();
            }

            if (!isDropDown) {
                hostc = $('body');
                isFixed = 1;
                header.show();
            }

            if (showHeader) {
                header.show();
            }

            hostc.append(modal);
            hostc.append(wrap);
            wrap.show();
            p.isOpen = 1;

            //layPopup(0, 1); // can shrink
            layPopup(0, isDropDown);

            dpop[p.i] = $opener;

            setTimeout(function () {
                $doc.on(sddpOutClEv, outClickClose);
            }, 100);

            if (!isMobile() && !p.nf) {
                setTimeout(function () {
                    var popTab = popup.find(':tabbable:first');
                    if (popTab.length) {
                        popTab.focus();
                    } else {
                        wrap.find(':tabbable:first').focus();
                    }
                },
                    10);
            }
        };

        api.close = function (nofocus) {
            wrap.hide();
            if (modal) modal.hide();
            p.isOpen = 0;
            if (p.cl) {
                p.cl();
            }

            popup.trigger('aweclose');

            if (!p.dntr) {
                wrap.remove();
                if (modal) modal.remove();
            }

            $doc.off(sddpOutClEv, outClickClose);

            if (!nofocus) {
                if ($opener && $opener.length) {
                    (o.ctf || $opener).focus();
                }
            }
        };

        api.destroy = function () {
            api.close();
            wrap.remove();
            if (modal) modal.remove();
            $win.off('resize domlay', resizeHandler);
        };

        popup.data('api', api);

        header = $(rdiv('o-phdr', rdiv('o-ptitl', (p.t || snbsp)) + sclosespan));

        $dropdownPopup.prepend(header);
        header.find('.o-cls').click(api.close);

        function getDragPopup() {
            itmoved = 1;
            return $dropdownPopup;
        }

        dragAndDrop({
            from: header,
            ch: getDragPopup,
            kdh: 1,
            cancel: function () { return fls; }
        });

        addFooter(p.btns, $dropdownPopup, popup, 'o-pbtns');

        function closeOnEsc(e) {
            if (which(e) == keyEsc) {
                var dtpf = $(e.target).closest('.awe-datepicker-field');
                if (dtpf.length && dtpf.find('.awe-val').datepicker('widget').is(':visible')) {

                } else {
                    if (!popup.data('esc')) {
                        api.close();
                    }
                }

                popup.data('esc', null);
            }
        }

        $dropdownPopup.on(skeyup, closeOnEsc);

        return wrap;
    }

    function uiPopup(o) {
        var soption = "option";
        var pp = o.p;
        var popup = pp.d;

        pp.mlh = 0;

        var autoSize = awe.autoSize;
        var fullscreen = pp.f;
        var draggable = true;

        if (!pp.r) pp.r = false;

        if (fullscreen) {
            pp.r = false;
            draggable = false;
            pp.m = true;
        }

        pp.uiw = pp.w;
        if (!pp.uiw) pp.uiw = 700;

        popup.dialog({
            draggable: draggable,
            width: pp.uiw,
            height: pp.h,
            modal: pp.m,
            resizable: pp.r,
            buttons: pp.btns,
            autoOpen: false,
            title: pp.t,
            resizeStop: function () {
                pp.uiw = popup.dialog(soption, 'width');
                pp.h = popup.dialog(soption, sheight);
                pp.p = popup.dialog(soption, sposition);
            },
            dragStop: function () {
                pp.p = popup.dialog(soption, sposition);
            }
        });

        var dialogClass = "awe-uidialog awe-popupw";
        if (o.rtl) {
            dialogClass += ' awe-rtl';
        }

        if (pp.pc) dialogClass = dialogClass + " " + pp.pc;
        popup.dialog(soption, { dialogClass: dialogClass });

        var autoResize = function () { };
        if (fullscreen || autoSize) {
            //autosize
            autoResize = function (e) {
                if (popup.is(':visible'))
                    if (!e || e.target == window || e.target == document) {

                        var wh = $win.height();
                        var ww = $win.width();

                        var sw = pp.uiw > ww - 10 || fullscreen ? ww - 10 : pp.uiw;
                        var sh = pp.h > wh - 5 || fullscreen ? wh - 20 : pp.h;
                        var opt = {
                            height: sh,
                            width: sw
                        };

                        //on ie9 it goes off screen on zoom when setting position
                        if (!fullscreen && pp.p) opt.position = pp.p;
                        popup.dialog(soption, opt).trigger('aweresize');
                    }
            };

            $win.on('resize', autoResize);
            autoResize();
            popup.on(schange, autoResize);
        }//end if fullscreen or autoSize 

        popup.on('dialogclose', function () {
            popup.trigger('aweclose');

            pp.isOpen = 0;
            if (pp.cl) {
                pp.cl.call(o);
            }

            if (!pp.dntr) {
                if (autoSize || fullscreen) {
                    $win.off('resize', autoResize);
                }

                popup.find('*').remove();
                popup.remove();
            }


        }).on('dialogresize', function () {
            popup.trigger('aweresize');
        });

        popup.on('aweload awebeginload', function () {
            o.avh = 0;
            popup.trigger('aweresize');
        });

        var api = function () { };
        api.open = function () {
            popup.dialog('open');
            pp.isOpen = 1;
            popup.trigger('aweopen');
            autoResize();
        };
        api.close = function () {
            popup.dialog('close');
        };
        api.destroy = function () {
            api.close();
            $win.off('resize', autoResize);
            popup.remove();
        };

        popup.data('api', api);
    }

    function bootstrapPopup(o) {
        var p = o.p; //popup properties
        var popup = p.d; //popup div
        var modal = $('<div class="modal" tabindex="-1" role="dialog" aria-hidden="true">' +
            '<div class="modal-dialog"><div class="modal-content awe-popupw"><div class="modal-header">' +
            rbtn('close', '&times;', 'data-dismiss="modal" aria-hidden="true"') +
            '<h4 class="modal-title"></h4></div></div></div></div>');

        var hasFooter = p.btns && p.btns.length;

        //minimum height of the lookup/multilookup content
        p.mlh = !p.f ? 250 : 0;

        if (!p.t) {
            p.t = snbsp; //put one space when no title
        }

        popup.addClass("modal-body");
        popup.css('overflow', 'auto');

        modal.find('.modal-content').append(popup);
        modal.find('.modal-title').html(p.t);
        popup.show();

        //use to resize the popup when fullscreen
        function autoResize() {
            var h = $win.height() - 120;
            if (hasFooter) h -= 90;
            if (h < 400) h = 400;
            popup.height(h);
            popup.trigger('aweresize');
        }

        var api = function () { };
        api.open = function () {
            modal.appendTo($('body')); //appendTo each time to prevent modal to show under current top modal
            modal.modal('show');
            p.isOpen = 1;
            popup.trigger('aweopen');
            if (p.f) autoResize();
        };
        api.close = function () {
            modal.modal('hide');

            p.isOpen = 0;
            if (p.cl) {
                p.cl();
            }
            if (!p.dntr) {
                popup.find('*').remove();
                popup.closest('.modal').remove();
            }
        };

        api.destroy = function () {
            api.close();
            $win.off('resize', autoResize);
            popup.closest('.modal').remove();
        };

        popup.data('api', api);

        modal.on('hidden.bs.modal', function () {
            popup.trigger('aweclose');
        });

        $('body').append(modal);

        //fullscreen
        if (p.f) {
            modal.find('.modal-dialog').css('width', 'auto').css('margin', '10px');
            $win.on('resize', autoResize);
        }

        //add buttons if any
        if (hasFooter) {
            var footer = $('<div class="modal-footer"></div>');
            modal.find('.modal-footer').remove();
            modal.find('.modal-content').append(footer);
            $.each(p.btns, function (i, e) {


                var btn = $(rbtn("btn btn-default", e.text));
                btn.click(function () { e.click.call(popup); });
                footer.append(btn);
            });
        }
    }

    function addFooter(btns, cont, popup, fclass) {
        // add btns if any
        if (btns && btns.length) {
            var btnslen = btns.length;

            var footer = $('<div/>').addClass(fclass);

            if (reverseDefaultBtns && btnslen > 1) {
                if (btns[btnslen - 1].c) {
                    var cbtn = btns.pop();
                    var kbtn = btns.pop();
                    btns.push(cbtn);
                    btns.push(kbtn);
                }
            }

            $.each(btns, function (i, el) {
                var cls = !el.k ? 'awe-sbtn' : 'awe-okbtn';
                var btn = $(rbtn('awe-btn ' + cls + ' o-pbtn', el.text));

                if (el.tag) {
                    var tag = el.tag;
                    if (tag.K)
                        $.each(tag.K, function (indx, key) {
                            btn.attr(key, tag.V[indx]);
                        });
                }

                btn.click(function () { el.click.call(popup); });
                footer.append(btn);
            });

            cont.append(footer);
        }
    }

    function inlinePopup(o) {
        var p = o.p; //popup properties
        var popup = p.d; //popup div
        var wrap = $('<div class="o-inlp awe-popupw"></div>').hide();

        //minimum height of the lookup/multilookup content
        p.mlh = 250;

        wrap.append(popup);

        //decide where to attach the inline popup
        //tag and tags are set using .Tag(object) .Tags(string)
        if (o.tag && o.tag.target) {
            $('#' + o.tag.target).append(wrap);
        } else if (o.tag && o.tag.cont) {// cont used in grid nesting
            o.tag.cont.prepend(wrap);
        } else if (o.tags) {
            $('#' + o.tags).append(wrap);
        } else if (o.f) { //component field
            o.f.after(wrap);
        } else {
            $('body').prepend(wrap);
        }

        var api = function () { };
        api.open = function () {
            wrap.show();
            p.isOpen = 1;
            popup.trigger('aweopen');
        };
        api.close = function () {
            wrap.hide();
            p.isOpen = 0;
            if (p.cl) {
                p.cl();
            }
            popup.trigger('aweclose');
            if (!p.dntr) {
                wrap.remove();
            }
        };
        api.destroy = function () {
            api.close();
            wrap.remove();
        };

        popup.data('api', api);

        var closeBtn = $(rbtn('awe-btn', snbsp + '&times;' + snbsp)).click(api.close);

        if (readTag(o, "Sh", 1)) {
            wrap.prepend($('<div class="o-inltitl"></div>').append(closeBtn).append("<span class='o-inltxt'>" + p.t + "</span>"));
        }

        addFooter(p.btns, wrap, popup);

        return wrap;
    }

    function gridPageInfo(o) {
        var $grid = o.v;
        var $pageInfo = $('<div class="o-gpginf"></div>');
        var delta = 0;
        var $footer = $grid.find('.awe-footer');
        if (!$footer.length) return;

        $grid.on(sawerowch, function (e, data) {
            if (data) {
                delta += data;
                render();
            }
        });

        $grid.find('.awe-footer').append($pageInfo);

        $grid.on('awebfren', function (e) {
            if (!$(e.target).is($grid)) return;
            delta = 0;
            render();
        });

        function render() {
            var lrs = dto($grid).lrs;
            var pageSize = lrs.ps;
            var itemsCount = lrs.ic + delta;

            var first = pageSize * (lrs.p - 1) + 1;
            var last = lrs.pgn ? first + pageSize - 1 + delta : itemsCount;
            if (last > itemsCount) last = itemsCount;
            if (!itemsCount || !last) first = 0;

            $pageInfo.html(first + ' - ' + (last) + ' ' + format(cd().GridInfo, [itemsCount]));
        }
    }

    function gridPageSize(o) {
        if (isMobile()) return;

        var items = [5, 10, 20, 50];
        function addIfLacks(ni) {
            if (!contains(ni, items)) {
                items.push(ni);
                items.sort(function (a, b) {
                    return a - b;
                });
            }
        }

        var $grid = o.v;

        var $footer = $grid.find('.awe-footer');
        if (!$footer.length) return;

        $grid.find('.awe-footer').append('<div class="awe-ajaxradiolist-field o-gpgs" ><input id="' + o.i + 'PageSize" class="awe-val" type="hidden" value="' + o.ps + '" /><div class="awe-display"></div></div>');

        addIfLacks(o.ps);

        var psi = o.i + 'PageSize';

        function setPages() {
            return $.map(items, function (val) {
                return { c: val, k: val };
            });
        }

        awe.radioList({ i: psi, nm: psi, df: setPages, l: 1, md: awem.odropdown, tag: { InLabel: "page size: " } });

        o.data.keys.push("pageSize");
        o.data.vals.push(psi);
        o.data.l.push(1);
    }

    function gridInfScroll(o) {
        var $grid = o.v;
        var con = $grid.find(sawecontentc);
        var scon = con.children().first();
        var loading;
        var gonext = 0;
        var lastSt;
        function adjustMargin() {
            var diff = (Math.max((con.height() - scon.height()) + 25, 25));

            scon.css('margin-bottom', diff + 'px');
        }

        adjustMargin();

        function setSt(st) {
            lastSt = st;
            con.scrollTop(st);
        }

        con.on('scroll', function () {
            var res = o.lrs;
            var st = con.scrollTop();
            var sconh = scon.outerHeight(true);
            var conh = con.innerHeight();
            var maxst = sconh - conh + 1;
            var lst = lastSt;

            adjustMargin();

            if (loading) {
                con.scrollTop(lst);
            } else {
                if (lst < st) {

                    if (gonext < 0) {
                        gonext = 0;
                    }

                    if (st > maxst - 3) {
                        gonext++;
                        if (gonext > 1 && res.p < res.pc) {
                            loading = 1;
                            $.when(nextPage())
                                .done(function () {
                                    gonext = loading = 0;
                                    st = 1;
                                    setSt(st);
                                });
                        } else {
                            st--;
                            setSt(st);
                        }
                    }
                }
                else if (lst > st) {

                    if (gonext > 0) {
                        gonext = 0;
                    }

                    if (st < 3) {
                        gonext--;
                        if (gonext < -2 && res.p > 1) {
                            loading = 1;
                            $.when(prevPage())
                                .done(function () {
                                    gonext = loading = 0;
                                    st = maxst;
                                    setSt(st);
                                });
                        } else {
                            st++;
                            setSt(st);
                        }
                    }
                }

                lastSt = st;
            }

            function nextPage() {
                return dapi($grid).load({ oparams: { page: res.p + 1 } });
            }

            function prevPage() {
                return dapi($grid).load({ oparams: { page: res.p - 1 } });
            }
        });
    }

    function isMobileOrTablet() {
        return false;
    }

    var clientDict = {
        Empty: 'empty',
        GridInfo: "of {0} items",
        Select: 'please select',
        SearchForRes: 'search for more results',
        Searchp: 'search...',
        NoRecFound: 'no records found',
        Months: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
        Days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    };

    function gridLoading(o, opt) {
        opt = opt || {};
        opt.lhtm = opt.lhtm || '<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>';
        var ctm = opt.ctm || 40;

        var $grid = o.v;
        var $mcontent = $grid.find(sawecontentc);

        function setNoRec() {
            $mcontent.find('.o-gempt').remove();
            if (!$mcontent.find(sawerowc).length) {
                $mcontent.prepend($('<div class="o-gempt">' + cd().NoRecFound + '</div>')
                    .css('margin-top', Math.max(($mcontent.height() / 2) - 90, 10) + 'px'));
            }
        }

        $grid.on('awebeginload', function (e) {
            if ($(e.target).is($grid)) {
                $grid.find('.o-gempt').remove();

                var $spin = $('<div class="spinCont">' + opt.lhtm + '</div>').hide();
                $spin.height($mcontent.height());
                $mcontent.prepend($spin);
                $spin.children().first().css('margin-top', ($mcontent.height() / 2 - ctm) + 'px');
                $spin.delay(150).fadeIn();

            }
        }).on(saweload, function (e) {
            if ($(e.target).is($grid)) {
                $mcontent.find('.spinCont:first').fadeOut().remove();
                setNoRec();
            }
        }).on(sawerowch, setNoRec);
    }

    function gridMovRows(opt) {
        return function (o) {
            var $grid = o.v;
            var placeh;
            var $fromCont = $grid.find(sawecontentc);
            var hovered;
            var drgObj;
            var rowmodel;
            var prevIndx;
            var ogrow;
            var hi, di;
            var grids = [o.v.attr('id')];
            var currhovering;
            var isOn;

            function getRow($c) {
                return dapi($c.closest(sawegridcls)).renderRow(rowmodel);
            }

            function wrap(clone, dragObj) {
                placeh = ogrow = currhovering = null;

                prevIndx = dragObj.index();
                drgObj = dragObj;
                rowmodel = drgObj.data(smodel);

                var res = $('<div/>').append($('<table/>').append(dragObj.closest('table').find('colgroup').clone()).append(clone))
                                     .prop('class', $grid.prop('class'));

                return res;
            }

            function hoverFunc($c) {
                return function (dragObj, x, y) {
                    var st = $win.scrollTop();

                    if (placeh) {
                        placeh.detach();
                    }

                    if (currhovering != $c) {
                        currhovering = $c;
                        placeh = getRow($c).addClass(sawechanging);
                        ogrow = placeh.clone();
                    }

                    drgObj.show();
                    di = drgObj.index();

                    if (!$c.is($fromCont)) {
                        $c.find('.awe-tbody').prepend(ogrow.show());
                        di = 0;
                    }

                    hovered = null;
                    $c.find(sawerowc).each(function (_, el) {
                        var $el = $(el);
                        if ($el.offset().top + $el.height() > y) {
                            hovered = $el;
                            return false;
                        }
                    });

                    if (hovered == null) {
                        $c.find('.awe-tbody').append(placeh);
                    } else {
                        hi = hovered.index();
                        if (di > hi) {
                            hovered.before(placeh);
                        } else {
                            hovered.after(placeh);
                        }
                    }

                    if ($win.scrollTop() != st) {
                        $win.scrollTop(st);
                    }

                    drgObj.hide();
                    ogrow.hide();
                }
            }

            function dropFunc($c) {
                return function (dragObj) {
                    var newRow = getRow($c);

                    if (hovered == null) {
                        $c.find('.awe-tbody').append(newRow);
                    } else if (di > hi)
                        hovered.before(newRow);
                    else {
                        hovered.after(newRow);
                    }

                    dragObj.remove();
                    var $toGrid = $c.closest(sawegridcls);
                    //$toGrid.trigger('awerowmove', [newRow, prevIndx, $fromCont]);
                    newRow.trigger('awedrop', { from: $fromCont, previ: prevIndx });

                    if (!$toGrid.is($grid)) {
                        movedGridRow($grid, $toGrid);
                    }
                };
            }

            // called on move when switching containers and end
            function resetHover() {
                if (placeh) {
                    placeh.detach();
                    ogrow.detach();
                }
            }

            function end() {
                drgObj.show();
            }

            var feat = { apply: apply };

            function apply() {
                if (isOn) return;

                var to = [];
                var scroll = [];

                if (opt && opt.G) {
                    grids = opt.G;
                }

                $.each(grids, function (i, val) {
                    var $grid = $('#' + val).find(sawecontentc);
                    to.push({ c: $grid, drop: dropFunc($grid), hover: hoverFunc($grid) });
                    scroll.push({ c: $grid, y: 1 });
                });

                scroll.push({ c: $win, y: 1 });

                var remf = dragAndDrop({
                    from: $fromCont,
                    sel: '.awe-row:not(' + sglrowc + ')',
                    to: to,
                    wrap: wrap,
                    reshov: resetHover,
                    scroll: scroll,
                    cancel: function (isTouch, coords) {
                        var rleft = coords.pageX - $fromCont.offset().left;
                        return isTouch && (($fromCont.width() - rleft < 100 || rleft < 100));
                    },
                    end: end
                });

                feat.rem = function () {
                    if (isOn) {
                        remf();
                        isOn = 0;
                    }
                }

                isOn = 1;
            }

            o.api.ft['mvr'] = feat;

            apply();

            feat.apply = apply;
        };
    }

    function gridInlineEdit(createUrl, editUrl, oneRow, reloadOnSave, rowClick) {
        return function (o) {
            var $grid = o.v;
            var api = dapi($grid);
            var newic = 1;
            var activeRow;

            function oneRowCheck(action) {
                if (oneRow) {
                    var otherRow = $grid.find(sglrowc).first();
                    if (otherRow.length && otherRow.data(sstate) != 3) {
                        checkAndPreventActionUntilSave(otherRow, action);
                        return 1;
                    }
                }
            }

            api.inlineCreate = function inlineCreate(newModel) {
                if (oneRowCheck(function () { inlineCreate(newModel); })) {
                    return;
                }

                newModel = newModel || {};
                var $newRow = api.renderRow(newModel);
                $newRow.addClass(snewrow);
                $grid.find('.awe-content:first .awe-tbody:first').prepend($newRow);
                $grid.trigger(sawerowch);
                inlineEdit($newRow);
            };

            api.inlineEdit = inlineEdit;
            api.inlineCancel = function ($row, focus) { cancelRow($row, focus); };
            api.inlineSave = save;

            function isMine(trg) {
                return trg.closest(sawegridcls).is($grid);
            }

            $grid.on(sclick, '.o-glsvb', function () {
                var trg = $(this);
                if (isMine(trg)) {
                    save(trg.closest(sawerowc), 1);
                }
            })
            .on(sclick, '.o-glcanb', function () {
                var trg = $(this);
                if (isMine(trg)) {
                    api.inlineCancel(trg.closest(sawerowc), 1);
                }
            })
            .on(sclick, '.o-gledtb', function () {
                var trg = $(this);
                if (isMine(trg)) {
                    inlineEdit(trg.closest(sawerowc));
                }
            });

            function inlineEdit($row, td) {
                if (oneRowCheck(function () { inlineEdit($row, td); })) {
                    return;
                }

                activeRow = $row;

                $row.addClass(sglrow + ' awe-nonselect');

                var $colgroup = $row.closest('.awe-table').find('colgroup');
                var model = $row.data(smodel);

                var hidden = se;

                var prefix = o.i + (model[o.k] || se);

                if ($row.hasClass(snewrow)) {
                    prefix += 'new' + (newic++);
                }

                var needLoading = [];

                $.each(o.columns, function (_, column) {
                    var tdi = $colgroup.find('col[data-i="' + column.ix + '"]').index();
                    var tag = column.Tag;
                    if (tag) {
                        function getVal(prop) {
                            var val = model[o.lrs.a ? toLowerFirst(prop) : prop];

                            val = awe.rgv(val);
                            val = val instanceof Array ? JSON.stringify(val) : val;
                            return val;
                        }

                        function parseFormat(format, value) {

                            var boolVal = value ? 'checked' : se;
                            format = format.split('#Value').join(escape(value))
                                .split('#Prefix').join(prefix)
                                .split('#ValChecked').join(boolVal);

                            for (var key in model) {
                                var sval = getVal(key);

                                format = format.split(".(" + key + ")").join(sval)
                                               .split(".(" + toUpperFirst(key) + ")").join(sval)
                                               .split("." + key).join(sval)
                                               .split("." + toUpperFirst(key)).join(sval);
                            }

                            format = format.replace(/\.\(\w+\)/g, "");
                            return format;
                        }

                        var inlelms = tag.Format;

                        if (tag.FormatFunc) {
                            inlelms = eval(tag.FormatFunc)(model, tag.Fpar);
                        }

                        if (inlelms) {
                            var gtd = $row.children().eq(tdi);
                            if (!column.Hid) {
                                gtd.empty();
                            }

                            for (var j = 0; j < inlelms.length; j++) {
                                var el = inlelms[j];
                                var val = getVal(el.ValProp);

                                var hformat = parseFormat(el.Format, val);

                                if (column.Hid) {
                                    hidden += hformat;
                                } else {

                                    var validstr = el.ModelProp && hformat.indexOf("awe-gvalidmsg") == -1 ? rdiv('awe-gvalidmsg ' + el.ModelProp) : se;
                                    var cellcont = rdiv('oinlc', rdiv('oinle', hformat) + validstr);
                                    addHidden(gtd.append(cellcont));
                                }

                                if (el.JsFormat) {
                                    needLoading.push(parseFormat(el.JsFormat, val));
                                }
                            }
                        }
                    }
                });

                if (hidden) {
                    addHidden($row.children().last());
                }

                function addHidden(cont) {
                    if (hidden) {
                        cont.append($('<div>' + hidden + '</div>').hide());
                        hidden = se;
                    }
                }

                if (needLoading.length) {
                    for (var i = 0; i < needLoading.length; i++) {
                        eval(needLoading[i]);
                    }
                }

                var ins = $row.find(':input').serializeArray();
                $row.data('ins', ins);
                $row.trigger(saweinledit);
                var fsel = ':tabbable:not(.hasDatepicker):first';

                if (!isMobile()) {
                    setTimeout(function () {
                        if (td && td.find(fsel).length) {
                            td.find(fsel).focus();
                        } else {
                            $row.find(fsel).focus();
                        }
                    });
                }

                if (rowClick) {
                    setTimeout(function () {
                        regOutClick($row);
                    });
                }
            }

            function save($row, isClick) {
                if ($row.data('slock')) {
                    return;
                }

                $row.data('slock', 1);
                $row.data(sstate, 2);

                var url = $row.hasClass(snewrow) ? createUrl : editUrl;
                var sdata = $row.find(':input').serializeArray();

                var diff = 0;
                var ins = $row.data('ins');
                if (ins.length != sdata.length) {
                    diff = 1;
                } else {
                    for (var i = 0; i < ins.length; i++) {
                        if (ins[i].name != sdata[i].name || ins[i].value != sdata[i].value) {
                            diff = 1;
                            break;
                        }
                    }
                }

                if (!diff && !$row.hasClass(snewrow)) {
                    cancelRow($row, isClick);
                    return 1;
                }

                o.lrso = 1;
                $.post(url, sdata.concat(awe.params(o, 1)), function (rdata) {
                    $row.find('.awe-gvalidmsg').empty();
                    var errors = rdata.e;
                    if (errors) {
                        $row.data(sstate, 1);
                        $row.trigger(saweinlinv);

                        for (var k in errors) {
                            var msg = se;
                            for (var i = 0; i < errors[k].length; i++) {
                                msg += rdiv('field-validation-error', errors[k][i]);
                            }

                            if (!k || !$row.find('.' + k).length) {
                                $grid.find('.awe-gvalidmsg:last').append(msg);
                            } else {
                                $row.find('.' + k).html(msg);
                            }
                        }
                    } else {
                        $row.data(sstate, 3);

                        if (reloadOnSave) {
                            api.load();
                        } else if (rdata.Item) {
                            var $nrow = api.renderRow(rdata.Item);
                            $row.after($nrow).remove();
                            $nrow.addClass(sawechanging).removeClass(sawechanging, 1000).find('.o-gledtb').focus();
                            closeActiveRow($row);
                            $nrow.trigger(saweinlsave, { r: rdata });
                        } else {
                            var item = $row.data(smodel);
                            var key = o.k;

                            $.when(api.update(item[key])).done(function () {
                                closeActiveRow($row);
                                var row = api.select(item[key])[0];
                                if (isClick) focusRowEditBtn(row);
                                row.trigger(saweinlsave, { r: rdata });
                            });
                        }
                    }
                }).fail(function (p1, p2, p3) {
                    $row.data(sstate, 0);
                    awe.err(o, p1, p2, p3);
                }).always(function () {
                    $row.data('slock', 0);
                });
            }

            function cancelRow($row, isClick) {
                if ($row.hasClass(snewrow)) {
                    $grid.trigger(saweinlcancel);
                    $row.remove();
                } else {
                    var item = $row.data(smodel);
                    var row = api.renderRow(item);
                    $row.after(row).remove();
                    if (isClick) {
                        focusRowEditBtn(row);
                    }
                    row.trigger(saweinlcancel);
                }

                $grid.trigger(sawerowch);
                closeActiveRow($row);
            }

            function closeActiveRow($row) {
                if (activeRow && (activeRow.is($row) || !activeRow.closest(document).length)) {
                    activeRow = null;
                    if ($grid.find(sglrowc).length) {
                        activeRow = $grid.find(sglrowc).first();
                    }
                }
            }

            if (rowClick) {
                $grid.on('click focusin',
                    '.awe-row:not(.o-glar) td',
                    function (e) {
                        var td = $(this);
                        if (isMine(td)) {
                            var row = td.closest(sawerowc);

                            if ((e.type == 'focusin' ||
                                istrg(e, 'button')) &&
                                !row.hasClass(sglrow) ||
                                !row.closest(document).length) {
                                return;
                            }

                            activeRow = row;
                            if (!row.hasClass(sglrow)) {
                                inlineEdit(row, td);
                            } else {
                                regOutClick(row);
                            }
                        }
                    });
            }

            function regOutClick(row) {
                function outclick(e) {
                    function lookFor(src, pivot) {
                        var apid = pivot.attr('awepid');
                        if (apid) {
                            return lookFor(src, $('#' + apid));
                        }

                        if (pivot.closest(src).length) {
                            return 1;
                        }

                        var popup = pivot.closest('.o-pu');

                        if (popup.length) {
                            var pid = popup.data('i');
                            var popener = dpop[pid];
                            if (popener) {
                                return lookFor(src, popener);
                            }
                        }
                    }

                    var trg = $(e.target);
                    if (!$(row).closest(document).length) {
                        deregOutclick();
                    }
                    else if (!lookFor(row, trg) && !trg.closest('.ui-datepicker').length) {
                        save(row);
                        deregOutclick();
                        row.removeClass('o-glar');
                    }
                }

                var ev = saweinlsave + ' ' + saweinlcancel;

                function deregOutclick() {
                    $doc.off(sclick, outclick);
                    row.off(skeydown, onKeyDown);
                    row.off(ev, deregOutclick);
                }

                function onKeyDown(e) {
                    if (which(e) == keyTab) {
                        var tabls = row.find(':tabbable');
                        if ($(e.target).is(tabls.last()) && !e.shiftKey) {
                            prevDef(e);
                            row.next().find('td:first').click();
                        }
                        else if ($(e.target).is(tabls.first()) && e.shiftKey) {
                            prevDef(e);
                            row.prev().find('td:first').click();
                        }
                    }
                }

                if (row.hasClass('o-glar')) {
                    return;
                }

                row.addClass('o-glar');
                row.data(sstate, 0);

                $doc.on(sclick, outclick);

                row.on(skeydown, onKeyDown);
            }

            function checkAndPreventActionUntilSave(row, action) {
                var state = row.data(sstate);
                if (state == 3) {
                    action();
                } else {
                    if (!state) {
                        if (save(row)) {
                            action();
                            return;
                        }
                    }

                    if (!state || state == 2) {
                        var ev = saweinlsave + ' ' + saweinlinv;
                        function onSaveFin(e) {
                            row.off(ev, onSaveFin);
                            if (e.type == saweinlsave) {
                                action();
                            } else {
                                scrollTo(row, $grid.find(sawecontentc));
                            }
                        }

                        row.on(ev, onSaveFin);
                    } else if (row.data(sstate) == 1) {
                        scrollTo(row, $grid.find(sawecontentc));
                    }
                }
            }

            function onGridBeforeLoad(e, aobj) {
                if ($(e.target).is($grid)) {
                    var ierows = $grid.find(sglrowc).length;

                    if (ierows) {
                        var loadFunc = aobj.load;
                        aobj.load = null;

                        if (ierows == 1) {
                            checkAndPreventActionUntilSave(activeRow, loadFunc);
                        }
                    }
                }
            }

            if (rowClick) {
                $grid.on('awebeforeload', onGridBeforeLoad);
            }

            function focusRowEditBtn(row) {
                row.find('.o-gledtb').focus();
            }
        };
    }

    var regHandlers = { ca: {}, mp: {} }; // column autohide; minipager

    function gridColAutohide(o) {
        function isColumnHidden(column) {
            return !o.sgc && column.Gd || column.Hid;
        }

        function autohide(col) {
            return col.Tag && col.Tag.Autohide || 0;
        }

        var $grid = o.v;

        function autohideColumns(isInit) {
            if (!isInit && (!o.lrs || o.ldg)) return;

            var changes = 0;
            var avw = $grid.find('.awe-hcon').width() || $grid.find(sawecontentc).width() - awe.scrollw();
            var eo = dto($grid);

            if (avw < 0) return changes;

            if (!eo) {
                removeRegHandle(o, 'ca');
                return changes;
            }

            var ahcols = $.grep(eo.columns, function (col) {
                return autohide(col);
            }).sort(function (a, b) { return autohide(b) - autohide(a); }).reverse();

            // unhide autohidden
            $.each(ahcols, function (_, col) {
                if (col.Hid == 2) {
                    col.Hid = 0;
                    changes++;
                }
            });

            var contentWidth = o.api.conw();
            if (avw < contentWidth) {
                $.each(ahcols, function (_, col) {
                    if (!isColumnHidden(col)) {
                        col.Hid = 2;
                        changes--;
                        contentWidth -= col.W || col.Mw;
                        if (contentWidth <= avw) return false;
                    }
                });
            }

            if (changes) {
                if (!isInit) {
                    dapi($grid).render();
                }

                $grid.trigger(sawecolschange);
            }

            return changes;
        }

        $grid.on(saweinit, function (e) {
            if ($(e.target).is($grid)) {
                autohideColumns(1);
            }
        });

        removeRegHandle(o, 'ca');

        function resizeHandler() {
            autohideColumns();
        }

        $win.on('aweresize resize domlay', resizeHandler);

        regHandlers['ca'][o.i] = {
            h: resizeHandler,
            e: 'aweresize resize domlay'
        };
    }

    function removeRegHandle(o, k) {
        var reghandle = regHandlers[k][o.i];
        if (reghandle) {
            $win.off(reghandle.e, reghandle.h);
        }
    }

    function gridColSel(o) {
        var $grid = o.v;
        var scid = o.i + 'ColSel';

        $grid.find('.awe-footer').append('<div class="awe-ajaxcheckboxlist-field o-gcolsl" ><input id="' + scid + '" class="awe-val awe-array" type="hidden" /><div class="awe-display"></div></div>');

        function getColumnsDataFunc() {
            var result = [];
            $.each(o.columns, function (i, col) {
                var name = col.H || col.P || "col" + (i + 1);
                if (!(col.Tag && col.Tag.Nohide))
                    result.push({ k: i, c: name });
            });

            return result;
        }

        var so = '<i class="o-o"/>';

        awe.checkboxList({ i: scid, nm: scid, df: getColumnsDataFunc, l: 0, md: awem.multiselb, tag: { InLabel: so + so + so, NoSelClose: 1 } });
        var colSel = $('#' + scid);

        function setItems() {
            var selColIndx = []; // value
            $.each(o.columns,
                function (i, col) {
                    if (!col.Hid && !(col.Tag && col.Tag.Nohide)) selColIndx.push(i);
                });

            colSel.val(JSON.stringify(selColIndx));
            dapi(colSel).load();
        }

        $grid.on(saweinit + ' ' + sawecolschange + ' ' + saweload + ' ' + 'awereorder', function (e, d) {
            if ($(e.target).is($grid) && !(d && d.c)) {
                setItems();
            }
        });

        colSel.on(schange, function () {
            var colIndxs = $.parseJSON($(this).val() || "[]");
            $.each(o.columns, function (i, col) {
                if ($.inArray(i.toString(), colIndxs) == -1 && !(col.Tag && col.Tag.Nohide)) {
                    if (!col.Hid) {
                        col.Hid = 1; //hide column
                        if (col.Gd) {
                            //remove grouped when hiding column
                            col.Gd = 0;
                            o.lrso = 1;
                        }
                    }
                } else {
                    col.Hid = 0;
                }
            });

            var api = dapi($grid);
            api.persist();
            api.render();
            $grid.trigger(sawecolschange, { c: 1 });
        });
    }

    function gridMiniPager(o) {
        return gridAutoMiniPager(o, 1);
    }

    function gridAutoMiniPager(oo, useMiniPager) {
        var $grid = oo.v;
        var $footer = $grid.find('.awe-footer');
        if (!$footer.length) return;
        var api = dapi($grid);
        var original = api.buildPager;

        var miniPager = function (o) {
            var pageCount = o.lrs.pc;
            var page = o.lrs.p || 1;
            if (o.lrs.pgn) {
                var result = se;

                result += renderButton(1, icon('o-arw double left'), 0, page < 2, 'ba');
                result += renderButton(page - 1, icon('o-arw left'), 0, page < 2, 'b');

                result += renderButton(page, page, 1, 0, 'c');

                result += renderButton(page + 1, icon('o-arw right'), 0, pageCount <= page, 'f');
                result += renderButton(pageCount, icon('o-arw double right'), 0, pageCount <= page, 'fa');

                var $pager = $grid.find('.awe-pager');
                $pager.html(result);

                $pager.find('.awe-btn').on(sclick, function () {
                    var p = $(this).data('p');
                    var act = $(this).data('act');

                    $.when(dapi($grid).load({ start: function () { o.pg = parseInt(p); } })).done(function () {
                        var fbtn = $pager.find('[data-act=' + act + "]");
                        if (fbtn.is(':disabled')) {
                            $pager.find('.awe-btn:not(:disabled)').first().focus();
                        } else {
                            fbtn.focus();
                        }
                    });
                });

                setTimeout(function () {
                    api.lay();
                }, 10);
            }
        };

        decideSwitch();

        if (!useMiniPager) {
            removeRegHandle(oo, 'mp');

            $win.on('aweload resize domlay', tryminipager);

            regHandlers['mp'][oo.i] = {
                h: tryminipager,
                e: 'resize domlay'
            };

            function tryminipager() {
                if (decideSwitch()) {
                    api.buildPager(oo);
                };
            }
        }

        function decideSwitch() {
            var cval = api.buildPager;
            var pc = oo.lrs ? oo.lrs.pc : 0;
            var nval = useMiniPager || $win.width() < 1000 && pc > 5 ? miniPager : original;
            api.buildPager = nval;
            return nval != cval;
        }

        function icon(icls) {
            return '<span class="' + icls + '" aria-hidden="true"></span>';
        }

        function renderButton(page, caption, selected, disabled, act) {
            var clss = "awe-btn mpbtn ";
            if (selected) clss += saweselected + ' ';
            if (disabled) clss += "awe-disabled ";
            var dis = disabled ? sdisabled : se;
            return rbtn(clss, caption, 'data-p="' + page + '" data-act="' + act + '" ' + dis);
        }
    }

    function gridkeynav(o) {
        var grid = o.v;
        var api = dapi(grid);

        grid.addClass('keynav');
        grid.attr('tabindex', '0');
        var sctrl = slist(grid.find(sawecontentc), { sel: sawerowc, fcls: sfocus, sc: 'n', topf: topFunc, botf: botFunc, enter: onenter });

        function topFunc() {
            chpage(-1);
        }

        function botFunc() {
            chpage(1);
        }

        function onenter(e, focused) {
            if (focused.length) {
                prevDef(e);
                var shift = e.shiftKey;

                if (!shift && focused.find('.awe-movebtn').length) {

                    var next = pickAvEl([focused.next(), focused.prev()]);

                    focused.removeClass(sfocus);
                    focused.find('.awe-movebtn').click();

                    if (next) {
                        sctrl.focus(next);
                    }

                } else {
                    focused.click();
                }

                if (shift) {
                    if (grid.closest('.awe-lookup-popup').length) {
                        focused.addClass(saweselected);
                    }

                    var lookupPopup = grid.closest('.awe-lookup-popup, .awe-multilookup-popup');
                    if (lookupPopup.length) {
                        dto(lookupPopup).api.ok();
                    }
                }
            }
        }


        var nofocus;
        grid.keydown(function (e) {
            var trg = $(e.target);
            var k = which(e);
            if ((k == keyDown || k == keyUp) && trg.is('.awe-btn:not(.o-ddbtn)')) {
                trg = grid;
                grid.focus();
            }

            if (trg.is(grid)) {
                var keys = [40, 38, 35, 36, 34, 33];

                sctrl.keyh(e);

                if ($.inArray(k, keys) != -1) {
                    prevDef(e);
                }

                if (k == 34) {
                    // page down
                    chpage(1);
                } else if (k == 33) {
                    // page up
                    chpage(-1);
                } else if (k == 35) {
                    // end
                    sctrl.focus(grid.find(sawerowc).last());
                    sctrl.scrollToFocused();
                } else if (k == 36) {
                    // home
                    sctrl.focus(grid.find(sawerowc).first());
                    sctrl.scrollToFocused();
                } else if (k == 32) {
                    //space
                    onenter(e, grid.find('.' + sfocus));
                }
            }
        })
            .on('mousedown',
                function () {
                    nofocus = 1;
                    setTimeout(function () { nofocus = 0; }, 100);
                })
            .on('focusin',
                function (e) {
                    if (!nofocus && !$(e.target).is(':input')) {
                        sctrl.autofocus();
                    }

                    nofocus = 0;
                })
            .on('focusout',
                function () {
                    sctrl.remf();
                })
            .on(saweload, removeTabIndex);

        function removeTabIndex() {
            grid.find('.awe-footer .awe-btn').each(function () {
                var btn = $(this);
                btn.attr('tabindex', -1);
            });
        };

        function chpage(val) {
            var res = o.lrs;
            if (res.p < res.pc && val > 0 || res.p > 1 && val == -1) {
                $.when(api.load({ oparams: { page: res.p + val } })).done(function () {
                    var tof = null;
                    if (val < 0) tof = grid.find(sawerowc).last();
                    sctrl.autofocus(tof);
                });
            }
        }
    }

    function dragAndDrop(opt) {
        var dropContainers = [];
        var dropFuncs = [];
        var dropHoverFuncs = [];

        opt.to && $.each(opt.to, function (i, val) {
            dropContainers.push(val.c);
            dropHoverFuncs.push(val.hover);
            dropFuncs.push(val.drop);
        });

        return awe.rdd(opt.from, opt.sel, dropContainers, dropFuncs, opt.dragClass, opt.hide, dropHoverFuncs, opt.end,
            opt.reshov, opt.scroll, opt.wrap, opt.ch, opt.cancel, opt.kdh, opt.move, opt.dropSel, opt.hover, opt.drop, opt.handle, opt.gscroll);
    }

    function dragReor(opt) {
        var placeh;
        var splh = 'o-plh';
        var sel = opt.sel;
        var handle = opt.handle;
        var lasthovi;
        var fromCont;
        var previ;

        function wrap(clone, dragObj) {
            fromCont = dragObj.closest(opt.from);
            previ = dragObj.index();
            placeh = clone.clone().addClass(splh);
            return clone;
        }

        function reshov() {
            if (placeh) {
                placeh.detach();
            }
            lasthovi = null;
        }

        function hoverFunc(cont, dragObj, x, y, dragHandle) {
            var hovered;

            var elms = cont.find(sel).get();

            if (lasthovi != null) {
                var lelm = $(elms[lasthovi]);
                var loffset = lelm.offset();
                if (loffset.top + lelm.outerHeight() > y &&
                    loffset.top < y &&
                    loffset.left + lelm.outerWidth() > x &&
                    loffset.left < x) {
                    return cont;
                }
            }

            for (var i = 0; i < elms.length; i++) {
                var elm = $(elms[i]);

                var offset = elm.offset();

                if (offset.top + elm.outerHeight() > y && offset.left + elm.outerWidth() > x) {
                    lasthovi = i;

                    if (elm.is(placeh)) {
                        return cont;
                    }
                    hovered = elm;
                    break;
                }
            }


            var st = $win.scrollTop();

            if (hovered) {
                var pi = placeh.index();
                if (hovered.index() < pi || pi == -1) {
                    hovered.before(placeh);
                    lasthovi++;
                } else {
                    hovered.after(placeh);
                }
            } else {
                cont.append(placeh);
            }

            if (cont.css('overflow-anchor') != 'none') {
                // chrome page jump
                if (st != $win.scrollTop()) {
                    $win.scrollTop(st);
                }
            }

            return cont;
        }

        function dropFunc(cont, dragObj, x, y) {
            placeh.after(dragObj).remove();
            dragObj.trigger('awedrop', { from: fromCont, previ: previ });
        }

        function gscroll(cont) {
            if (cont) {
                return [{ c: cont, y: 1 }];
            }
        }

        function end() {
            placeh.remove();
            placeh = null;
            lasthovi = null;
        }

        awem.dragAndDrop({
            from: opt.from,
            sel: sel,
            handle: handle,
            dropSel: opt.to,
            wrap: wrap,
            hover: hoverFunc,
            drop: dropFunc,
            reshov: reshov,
            cancel: opt.cancel,
            gscroll: opt.gscroll || gscroll,
            end: end,
            hide: 1,
            scroll: [{ c: $(window), y: 1 }]
        });
    }

    function multilookupGrid(o) {
        var popup;
        var gridsrl, gridsel;
        var api = o.api;
        o.p.dh = o.p.h;
        api.gsval = getSelectedValue;

        function getSelectedValue() {
            if (gridsel && dto(gridsel).lrs) {
                return gridsel.find(sawerowc).map(function () { return $(this).data('k'); }).get();
            } else {
                return awe.val(dto(popup).v);
            }
        }

        api.lay = function () {
            if (gridsrl && gridsel) {

                var resth = popup.find('.awe-scon').height() -
                    gridsrl.outerHeight() -
                    gridsel.outerHeight() +
                    popup.outerHeight() -
                    popup.height();

                var avh = o.avh || popup.height();
                var newh = (avh - resth - 1) / 2;

                setGridHeight(gridsrl, newh);
                setGridHeight(gridsel, newh);
            }
        };

        api.rlay = function () {
            if (gridsrl) {
                initgridh(gridsrl);
            }

            if (gridsel) {
                initgridh(gridsel);
            }
        };

        api.rload = function () {
            dapi(gridsrl).load();
            dapi(gridsel).load();
        };

        o.v.on('awepopupinit', function () {
            gridsrl = null;
            gridsel = null;
            popup = o.p.d;

            popup.on(sclick, '.awe-movebtn', function (e) {
                var trg = $(e.target);
                var gridfrom = gridsel, gridto = gridsrl;
                if (trg.closest(gridsrl).length) {
                    gridfrom = gridsrl;
                    gridto = gridsel;
                }

                var trgRow = trg.closest(sawerowc);
                gridto.find('.awe-content .awe-tbody').prepend(dapi(gridto).renderRow(trgRow.data(smodel)));
                trgRow.remove();
                movedGridRow(gridfrom, gridto);
            });

            popup.on(saweinit, function (e) {

                var it = $(e.target);
                if (it.is(sawegridcls)) {
                    var gdo = dto(it);
                    gdo.pro = dto(popup);

                    var getSelected = function () { return { selected: getSelectedValue() }; };

                    gdo.parf = gdo.parf ? gdo.parf.concat(getSelected) : [getSelected];

                    if (it.is('.awe-srl')) {
                        gridsrl = it;
                    }
                    else if (it.is('.awe-sel')) {
                        gridsel = it;
                        api.lay();
                    }
                }
            });
        });

        o.p.af = 0;
    }

    function lookupKeyNav(o) {
        var popup;
        var api = o.api;
        o.v.on('awepopupinit', function () {
            popup = o.p.d;

            handleCont(o.srl.closest('.awe-list'));

            if (o.sel) {
                handleCont(o.sel.closest('.awe-list'));
            }

            function handleCont(cont) {
                cont.attr('tabindex', 0);

                var sctrl = slist(cont, { sel: '.awe-li', enter: onenter });

                function onenter(e, focused) {
                    prevDef(e);
                    var shift = e.shiftKey;
                    if (focused.is('.awe-morecont')) {
                        var prev = focused.prev();
                        focused.parent()
                            .one(saweload, function () {
                                var tofocus = pickAvEl([prev.next(), prev, cont.find('.awe-li').first()]);

                                sctrl.focus(tofocus);
                            });
                        focused.find('.awe-morebtn').click();
                    } else if (focused.find('.awe-movebtn').length && !shift) {
                        var tofocus = pickAvEl([focused.next(), focused.prev()]);

                        focused.removeClass(sfocus);
                        focused.find('.awe-movebtn').click();

                        if (tofocus) {
                            sctrl.focus(tofocus);
                        }
                    }
                    else {
                        focused.click();
                        if (shift) {
                            focused.addClass(saweselected);
                        }
                    }

                    if (shift) {
                        api.ok();
                    }
                }

                function handleKeys(e) {
                    var keys = [40, 38, 35, 36, 34, 33];
                    if (sctrl.keyh(e) || $.inArray(which(e), keys) != -1) {
                        prevDef(e);
                    }

                    if (which(e) == 32) { // space
                        onenter(e, cont.find('.focus'));
                    }
                }

                cont.keydown(handleKeys);
                cont.on('focusout', function () {
                    cont.find('.focus').removeClass(sfocus);
                }).on(skeyup, function (e) {
                    if (which(e) == 9)//tab
                        sctrl.autofocus();
                });
            }
        });
    }

    function lookupGrid(o) {
        var popup;
        var grid;
        var api = o.api;

        api.gsval = function () {
            return popup.find(saweselectedc).data('k');
        };

        api.lay = function () {

            if (grid) {
                var resth = popup.find('.awe-scon').height() - grid.outerHeight() + popup.outerHeight() - popup.height();

                var newh = (o.avh || popup.outerHeight()) - resth;

                setGridHeight(grid, newh);
            }
        };

        api.rlay = function () {
            if (grid) {
                initgridh(grid);
            }
        };

        api.rload = function () {
            dapi(grid).load();
        };

        o.v.on('awepopupinit', function () {
            popup = o.p.d;
            grid = null;

            popup.on('dblclick', sawerowc, function (e) {
                if (!istrg(e, '.awe-nonselect')) {
                    o.api.sval($(this).data('k'));
                }
            });

            popup.on(saweinit, function (e) {
                var g = $(e.target);
                if (g.is(sawegridcls)) {
                    dto(g).pro = dto(popup);
                    grid = g;
                    api.lay();
                }
            });
        });

        o.p.af = 0;
    }

    function tbtns(o) {
        var tabs = $('#' + o.i);

        function laybtns() {
            var av = tabs.width();
            var w = av;
            tabs.find('.awe-tabsbar br').remove();
            var btns = tabs.find('.awe-tab-btn');
            var len = btns.length;
            var isFirst = 1;
            for (var i = len - 1; i >= 0; i--) {
                var btn = btns.eq(i);
                w -= btn.outerWidth();

                if (w < 0) {
                    if (isFirst) continue;
                    btn.after('</br>');
                    isFirst = 1;
                    i++;
                    w = av;
                } else {
                    isFirst = 0;
                }
            }
        }

        tabs.on('awerender', function (e) {
            if (!$(e.target).is(tabs)) return;
            laybtns();
        });

        $win.off('resize domlay', laybtns).on('resize domlay', laybtns);
    }

    function dtp(o) {
        var id = o.i;
        var cmid = id + 'cm';
        var cyid = id + 'cy';
        var popupId = id + '-awepw';

        var monthNames = cd().Months;

        var dayNames = cd().Days.slice(0);

        if (awem.fdw) {
            dayNames.push(dayNames.shift());
        }

        var prm = o.p;
        var input = o.v;
        var openb = o.f.find('.awe-dpbtn');
        var selDate = null;
        var inline = prm.ilc;
        var inlCont = o.f.find('.awe-ilc');
        var rtl = o.rtl;
        var nxtcls = '.o-mnxt';
        var prvcls = '.o-mprv';

        if (rtl) {
            var c = nxtcls;
            nxtcls = prvcls;
            prvcls = c;
        }

        var cmdd;
        var cydd;
        var isOpening;
        var currDate;
        var today;

        var numberOfMonths;
        var defaultDate;
        var dateFormat;
        var changeYear;
        var changeMonth;
        var minDate;
        var maxDate;
        var amaxDate;
        var yearRange;

        var popup, cont;
        var wasOpen;
        var kval;

        init();

        input.attr('autocomplete', 'off');

        input.on(skeyup, keyuph)
           .on(skeydown, inpkeyd);

        openb.on(skeydown, function (e) {
            var key = which(e);
            if (key == keyEnter) {
                wasOpen = !isOpen();
            }

            if (keynav(key)) {
                prevDef(e);
            }
        }).on(skeyup, keyuph);

        if (inline) {
            openDtp();
        } else {
            if (!isMobile()) {
                input.on(sclick, openDtp);
            }

            openb.on(sclick, openDtp);
        }

        input.change(function () {
            setVal(tryParse(input.val()));
        });

        o.api.getDate = function () {
            return tryParse(input.val());
        }

        o.api.setDate = function (val) {
            input.val($.datepicker.formatDate(dateFormat, val)).change();
        }

        function setVal(newVal) {
            if (newVal && (!selDate || newVal.getTime() != selDate.getTime())) {
                selDate = newVal;
                if (cont && inline || isOpen()) {
                    setCurrDate(selDate);
                    updateCalendar();
                }
            }
        }

        function setCurrDate(newDate) {
            if (minDate && newDate < minDate) {
                currDate = cdate(minDate);
            }
            else if (amaxDate && newDate > amaxDate) {
                currDate = cdate(amaxDate);
            } else {
                currDate = cdate(newDate);
            }
        }

        function moveHov(dir) {
            var pivot = getHov();
            var sel = '.o-enb';
            if (cont.find(nxtcls).is(':enabled')) {
                sel = '.o-mnth:first ' + sel;
            }

            var list = cont.find(sel);

            var indx = list.index(pivot) + dir;
            var n = list.eq(indx);

            if (!n.length || indx < 0) {
                n = 0;
                var cls = dir > 0 ? nxtcls : prvcls;
                var fl = dir > 0 ? 'first' : 'last';
                var nbtn = cont.find(cls);

                if (nbtn.is(':enabled')) {
                    cont.find(cls).click();
                    n = cont.find('.o-mnth:first .o-enb:' + fl);
                }
            }

            if (n && n.length) {
                cont.find('.o-hov').removeClass('o-hov');
                n.addClass('o-hov');
            }
        }

        function keynav(key) {
            var res = 0;
            if (isOpen()) {
                if (key == keyDown) {
                    moveHov(1);
                    res = 1;
                }
                else if (key == keyUp) {
                    moveHov(-1);
                    res = 1;
                }
            }

            if (res) cont.addClass('o-nhov');
            return res;
        }

        function inpkeyd(e) {
            var key = which(e);

            if (keynav(key) || key == keyEnter) {
                prevDef(e);
            }

            if (!isOpen()) {
                if (key == keyDown || key == keyUp) {
                    openDtp(e);
                }
            }

            // / / . . - -
            awe.pnn(e, [191, 111, 190, 110, 189, 109]);

            kval = input.val();
        }

        function keyuph(e) {
            var k = which(e);

            if (isOpen()) {
                if (k == keyEnter) {
                    if (!wasOpen) {
                        getHov().click();
                    }
                } else if (!inline && k == keyEsc) {
                    dapi(popup).close();
                    e.stopPropagation();
                }
                else if (input.val() != kval) {
                    setVal(tryParse(input.val()));
                }
            }

            wasOpen = 0;
        }

        function isOpen() {
            return cont && cont.closest('body').length;
        }

        function getHov() {
            var h = cont.find('.o-hov');
            if (!h.length) h = cont.find('.o-enb:hover');
            if (!h.length) h = cont.find('.o-enb.o-selday');
            if (!h.length) h = cont.find('.o-enb.o-tday');
            if (!h.length) h = cont.find('.o-enb:first');

            return h;
        }

        function tryParse(sval) {
            var val = 0;
            try {
                val = $.datepicker.parseDate(dateFormat, sval);
            }
            catch (err) {
            }

            return val;
        }

        function init() {
            today = cdate();
            remTime(today);

            numberOfMonths = prm.numberOfMonths || 1;
            defaultDate = prm.defaultDate;
            dateFormat = prm.dateFormat;
            changeYear = prm.changeYear;
            changeMonth = prm.changeMonth;
            minDate = prm.minDate;
            maxDate = prm.maxDate;
            yearRange = prm.yearRange;

            if (prm.min) {
                minDate = tryParse(prm.min);
            }

            if (prm.max) {
                maxDate = tryParse(prm.max);
            }

            if (maxDate) {
                amaxDate = cdate(maxDate);
                amaxDate.setMonth(amaxDate.getMonth() - numberOfMonths + 1);
            }
        }

        function openDtp(e) {
            if (isOpen() || isOpening) return;
            isOpening = 1;

            init();

            if ($('#' + popupId).length) {
                dapi($('#' + popupId)).destroy();
            }

            selDate = tryParse(input.val());

            setCurrDate(selDate || defaultDate || today);

            remTime(currDate);

            cont = $(rdiv('o-dtp')).hide();
            cont.appendTo($('body'));

            if (inline) {
                cont.addClass('o-inl');
            }

            cont.html(render(currDate));
            changeMonth && awe.radioList({ i: cmid, nm: cmid, df: monthItems, md: awem.odropdown });
            changeYear && awe.radioList({ i: cyid, nm: cyid, df: yearItems, md: awem.odropdown });
            cmdd = $('#' + cmid);
            cydd = $('#' + cyid);

            updateCalendar(1);

            cont.on(smousemove, function () {
                cont.removeClass('o-nhov');
                cont.find('.o-hov').removeClass('o-hov');
            });

            cont.on(sclick,
                '.o-mday:not(.o-dsb)',
                function () {
                    var td = $(this);
                    cont.find('.o-selday').removeClass('o-selday');
                    td.addClass('o-selday');
                    selDate = new Date(td.data('y'), td.data('m'), td.data('d'));

                    input.val($.datepicker.formatDate(dateFormat, selDate));
                    awe.ach(o);
                    popup && dapi(popup).close();
                });

            cont.on(sclick,
                nxtcls,
                function () {
                    var ndate = cdate(currDate);
                    incMonth(ndate, 1);
                    setCurrDate(ndate);
                    updateCalendar();
                });

            cont.on(sclick,
                prvcls,
                function () {
                    var ndate = cdate(currDate);
                    incMonth(ndate, -1);
                    setCurrDate(ndate);
                    updateCalendar();
                });

            cont.show();

            if (inline) {
                inlCont.html(cont);
            } else {
                popup = $('<div id="' + popupId + '"/>');
                popup.append(cont);

                var ctf = input;
                if (input.is('[readonly]')) {
                    ctf = openb;
                }

                if (e && istrg(e, openb)) {
                    ctf = openb;
                }

                awem.dropdownPopup({
                    opener: o.f,
                    ctf: ctf,
                    rtl: rtl,
                    p: { d: popup, i: popupId, minw: 'auto', pc: 'o-dtpp', nf: 1 },
                    tag: { Dd: 1, MinWidth: '150px' }
                });


                dapi(popup).open(e);
            }

            cmdd.change(function () {
                var ndate = cdate(currDate);
                ndate.setDate(1);
                ndate.setMonth(cmdd.val());
                setCurrDate(ndate);
                updateCalendar();
            });

            cydd.change(function () {
                var ndate = cdate(currDate);
                ndate.setDate(1);
                ndate.setFullYear(cydd.val());
                setCurrDate(ndate);
                updateCalendar();
            });

            isOpening = 0;
        }

        function updateCalendar(init) {
            var monthcs = cont.find('.o-mnth');
            var mlen = monthcs.length;
            monthcs.each(function (i, el) {
                var day = cdate(currDate);
                incMonth(day, i);
                var mc = $(el);
                mc.find('.o-tb').html(renderDaysTable(day, mlen));

                if (i || !changeYear) mc.find('.o-yhd').html(pad(year(day)));
                if (i || !changeMonth) mc.find('.o-mhd').html(pad(month(day)));

                if (mlen == i + 1) {
                    var ldm = lastDayOfMonth(day);
                    setDisabled(cont.find(nxtcls), maxDate && ldm >= maxDate);
                }
            });

            var fdm = firstDayOfMonth(currDate);
            setDisabled(cont.find(prvcls), minDate && fdm <= minDate);

            changeMonth && dapi(cmdd.val(currDate.getMonth())).load();
            changeYear && dapi(cydd.val(currDate.getFullYear())).load();

            if (!init) {
                popup && dapi(popup).lay();
            }
        }

        function yearItems() {
            var y = year(currDate);

            var res = [];
            var startYear = y - 10;
            var endYear = y + 10;

            if (yearRange) {
                var yra = yearRange.split(":");
                startYear = calcYear(yra[0], y, year(today));
                endYear = calcYear(yra[1], y, year(today));
            }

            if (minDate) {
                startYear = Math.max(startYear, year(minDate));
            }

            if (amaxDate) {
                endYear = Math.min(endYear, year(amaxDate));
            }

            for (var i = startYear; i <= endYear; i++) {
                res.push({ c: i, k: i });
            }

            return res;
        }

        function monthItems() {
            var allowed = null;
            if (minDate || amaxDate) {
                var min = null, max = null;

                if (amaxDate) {
                    max = cdate(amaxDate);
                    max.setDate(1);
                }

                if (minDate) {
                    min = cdate(minDate);
                    min.setDate(1);
                }

                var start = cdate(currDate);

                start.setDate(1);
                start.setMonth(0);
                allowed = {};

                for (var j = 0; j < 12; j++) {
                    if ((!min || start >= min) && (!max || start <= max)) {
                        allowed[j] = 1;
                    }

                    incMonth(start, 1);
                }
            }

            var res = [];
            for (var i = 0; i < monthNames.length; i++) {
                if (!allowed || allowed[i])
                    res.push({ c: monthNames[i], k: i });
            }

            return res;
        }

        function render(currDate) {
            var res = se;
            for (var i = 0; i < numberOfMonths; i++) {
                var day = cdate(currDate);
                incMonth(day, i);

                res += rdiv('o-mnth', renderMonth(day, i == 0, i == numberOfMonths - 1), 'data-i="' + i + '"');
            }

            return res;
        }

        function renderDaysTable(pivotDay, mlen) {
            var fdm = firstDayOfMonth(pivotDay);
            var ldm = lastDayOfMonth(pivotDay);

            var pmd0 = startOfWeek(fdm);
            var nm1 = endOfWeek(ldm);

            var day = pmd0;

            var table = se;

            function renderDay(d) {
                var date = d.getDate();
                var m = d.getMonth();
                var y = d.getFullYear();
                var cls = 'o-day';
                var enb = 0;
                var out = 0;
                if (d < fdm || d > ldm) {
                    cls += ' o-outm';
                    out = 1;
                } else {
                    cls += ' o-mday';
                    enb = 1;
                }

                if (d <= today && d >= today && !out && mlen) {
                    cls += ' o-tday';
                }

                if (minDate && d < minDate || maxDate && d > maxDate) {
                    cls += ' o-dsb';
                } else if (enb) {

                    cls += ' o-enb';

                    if (selDate && d <= selDate && d >= selDate) {
                        cls += ' o-selday';
                    }
                }

                return '<td class="' +
                    cls +
                    '" data-d="' +
                    date +
                    '" data-m="' +
                    m +
                    '" data-y="' +
                    y +
                    '" ><div>' +
                    date +
                    '</div></td>';
            }

            table += '<tr class="o-wdays">';
            for (var di = 0; di < dayNames.length; di++) {
                table += '<td>' + dayNames[di] + '</td>';
            }
            table += '</tr>';

            var i = 1;
            var rowstarted = 0;
            var rowCount = 0;
            while (day <= nm1 || rowCount < 6) {
                if (!rowstarted) {
                    table += '<tr>';
                    rowstarted = 1;
                }

                table += renderDay(day);

                if (i == 7) {
                    table += '</tr>';
                    rowstarted = 0;
                    i = 0;
                    rowCount++;
                }

                nextDay(day);
                i++;
            }

            return table;
        }

        function renderMonth(pivotDay, first, last) {
            var mbtn = function (cls, icls) {
                return rbtn('o-cmbtn ' + cls, '<i class="o-arw ' + icls + '"></i>');
            }

            var topbar = '<div class="o-mtop">';

            if (first) {
                topbar += mbtn(rtl ? 'o-mnxt' : 'o-mprv', 'left');
            }

            var mval = pivotDay.getMonth();
            var yval = year(pivotDay);

            topbar += '<div class="o-ym"><div class="o-mhd">' +
                (first && changeMonth ? radioList(cmid, mval, 'o-cm') : pad(month(pivotDay))) +
                '</div>' +
                '<div class="o-yhd">' +
                (first && changeYear ? radioList(cyid, yval, 'o-cy') : pad(yval)) +
                '</div></div>';

            if (last) {
                topbar += mbtn(rtl ? 'o-mprv' : 'o-mnxt', 'right');
            }

            topbar += '</div>';

            return topbar + '<table class="o-tb"></table>';
        }

        function month(pivotDay) {
            var mval = pivotDay.getMonth();
            return monthNames[mval];
        }

        function year(pivotDay) {
            return pivotDay.getFullYear();
        }

        function pad(s) {
            return "<span class='o-txt'>" + s + "</span>";
        }

        function calcYear(fstr, cy, ty) {
            function f(res, i, fstr, cy, ty) {
                if (fstr[i] == 'c')
                    return f(cy, i + 1, fstr, cy, ty);
                if (fstr[i] == '-' || fstr[i] == '+')
                    if (res)
                        res = res + parseInt(fstr.substr(i));
                    else
                        res = ty + parseInt(fstr.substr(i));
                else return parseInt(fstr);

                return res;
            }

            return f(0, 0, fstr, cy, ty);
        }

        // utils methods

        function cdate(d) {
            return d ? new Date(d) : new Date();
        }

        function radioList(id, val, cls) {
            return rdiv('awe-ajaxradiolist-field ' + cls, '<input id="' + id +
                '" class="awe-val" type="hidden" value="' + val +
                '" />' + rdiv('awe-display'));
        }

        function startOfWeek(date) {
            var dat = cdate(date);

            var day = dat.getDay();
            var diff = dat.getDate() - day;

            if (awem.fdw) {
                diff += (day == 0 ? -6 : 1);
            }

            dat.setDate(diff);
            return dat;
        }

        function endOfWeek(d) {
            var dat = cdate(startOfWeek(d));
            dat.setDate(dat.getDate() + 6);
            return dat;
        }

        function firstDayOfMonth(d) {
            var dat = cdate(d);
            dat.setDate(1);
            return dat;
        }

        function lastDayOfMonth(d) {
            var nd = cdate(d);
            nd.setMonth(d.getMonth() + 1);
            nd.setDate(0);
            return nd;
        }

        function remTime(d) {
            d.setHours(0, 0, 0, 0);
        }

        function nextDay(d) {
            d.setDate(d.getDate() + 1);
        }

        function incMonth(d, m) {
            d.setDate(1);
            d.setMonth(d.getMonth() + m);
            return d;
        }
    }

    return {
        dtp: dtp,
        fdw: 0,
        tbtns: tbtns,
        lookupKeyNav: lookupKeyNav,
        multilookupGrid: multilookupGrid,
        lookupGrid: lookupGrid,
        gridMovRows: gridMovRows,
        dragAndDrop: dragAndDrop,
        dragReor: dragReor,
        clientDict: clientDict,
        gridInlineEdit: gridInlineEdit,
        gridLoading: gridLoading,
        gridInfScroll: gridInfScroll,
        gridPageSize: gridPageSize,
        gridPageInfo: gridPageInfo,
        gridColSel: gridColSel,
        gridColAutohide: gridColAutohide,
        btnGroup: buttonGroupRadio,
        btnGroupChk: buttonGroupCheckbox,
        bootstrapDropdown: bootstrapDropdown,
        multiselect: multiselect,
        colorDropdown: colorDropdown,
        imgDropdown: imgDropdown,
        combobox: combobox,
        timepicker: timepicker,
        menuDropdown: menuDropdown,
        odropdown: odropdown,
        dropdownPopup: dropdownPopup,
        uiPopup: uiPopup,
        bootstrapPopup: bootstrapPopup,
        inlinePopup: inlinePopup,
        isMobileOrTablet: isMobileOrTablet,
        multiselb: multiselb,
        gridAutoMiniPager: gridAutoMiniPager,
        gridMiniPager: gridMiniPager,
        gridKeyNav: gridkeynav,
        notif: notif,
        escape: escape,
        slist: slist
    };
}(jQuery);