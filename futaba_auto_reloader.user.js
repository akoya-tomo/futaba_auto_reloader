// ==UserScript==
// @name           futaba auto reloader k
// @namespace      https://github.com/akoya-tomo
// @description    KOSHIAN リロード拡張で自動更新しちゃう(実況モードもあるよ！)
// @author         akoya_tomo
// @include        http://*.2chan.net/*/res/*
// @include        https://*.2chan.net/*/res/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @version        1.7.1rev5
// @grant          GM_addStyle
// @license        MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAPUExURYv4i2PQYy2aLUe0R////zorx9oAAAAFdFJOU/////8A+7YOUwAAAElJREFUeNqUj1EOwDAIQoHn/c88bX+2fq0kRsAoUXVAfwzCttWsDWzw0kNVWd2tZ5K9gqmMZB8libt4pSg6YlO3RnTzyxePAAMAzqMDgTX8hYYAAAAASUVORK5CYII=
// @noframes
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
	/*
	 *	設定
	 */
	var USE_SOUDANE = true;								//そうだねをハイライト表示する
	var USE_CLEAR_BUTTON = true;					//フォームにクリアボタンを表示する
	var USE_TITLE_NAME = true;						//新着レス数・スレ消滅状態をタブに表示する
	var RELOAD_INTERVAL_NORMAL = 60000;		//リロード間隔[ミリ秒](通常時)
	var RELOAD_INTERVAL_LIVE = 5000;			//リロード間隔[ミリ秒](実況モード時)
	var LIVE_SCROLL_INTERVAL = 12;				//実況モードスクロール間隔[ミリ秒]
	var LIVE_SCROLL_SPEED = 2;						//実況モードスクロール幅[px]
	var LIVE_TOGGLE_KEY = "76";						//実況モードON・OFF切り替えキーコード(With Alt)
	var SHOW_NORMAL_BUTTON = true;				//通常モードボタンを表示する
	var USE_NOTIFICATION_DEFAULT = false;	// 新着レスの通知をデフォルトで有効にする
	var USE_SAVE_MHT = false;							// スレ消滅時にMHTで保存する
	var USE_BOARD_NAME = true;				//板名をタブに表示する
	var NOTIFY_THREAD_NOT_FOUND = false;	//スレの消滅を通知する（通知ボタンとは独立して動作）

	var res = 0;	//新着レス数
	var timerNormal, timerLiveReload, timerLiveScroll;
	var url = location.href;
	var script_name = "futaba_auto_reloader_k";
	var isWindowActive = true;	// タブのアクティブ状態
	var isNotificationEnable = USE_NOTIFICATION_DEFAULT;	// 通知の有効フラグ
	var serverName = document.domain.match(/^[^.]+/);
	var boardName = $("#tit").text().match(/^[^＠]+/);

	if(!isFileNotFound()){
		set_title();
		setNormalReload();
	}
	soudane();
	makeFormClearButton();
	reset_title();
	make_live_button();
	addCss();
	setWindowFocusEvent();

	//通常リロード開始
	function setNormalReload() {
		timerNormal = setInterval(rel, RELOAD_INTERVAL_NORMAL);
		console.log(script_name + ": Start auto reloading @" + url);
	
		document.addEventListener("KOSHIAN_reload", (e) => {
			soudane();
			changetitle();
			if (!isWindowActive && isNotificationEnable) {
				getNewResContent();
			}
		});

		document.addEventListener("KOSHIAN_reload_notfound", (e) => {
			clearNormalReload();
			changetitle();
			if (!isWindowActive && NOTIFY_THREAD_NOT_FOUND) {
				var popupText = "スレは落ちています\r\n自動更新を停止しました";
				showNotification(popupText);
			}
			console.log(script_name + ": Page not found, Stop auto reloading @" + url);
		});

	}
	//通常リロード停止
	function clearNormalReload() {
		clearInterval(timerNormal);
		console.log(script_name + ": Stop auto reloading @" + url);
	}
	/*
	 * 404チェック
	 */
	function isFileNotFound() {
		if(document.title == "404 File Not Found") {
			return true;
		}
		else {
			return false;
		}
	}

	/*
	 * ボタン作成
	 */
	function make_live_button() {
		var normal_flag = true;	//通常モード有効フラグ
		//通常モードボタン
		var $normalButton = $("<a>", {
			id: "GM_FAR_relButton_normal",
			class: "GM_FAR_relButton",
			text: "[通常]",
			title: (RELOAD_INTERVAL_NORMAL / 1000) + "秒毎のリロード",
			css: {
				cursor: "pointer",
				"background-color": "#ea8",
				display: "inline-block"
			},
			click: function() {
				normalMode();
			}
		});

		var live_flag = false;	//実況モード有効フラグ
		//実況モードボタン
		var $liveButton = $("<a>", {
			id: "GM_FAR_relButton_live",
			class: "GM_FAR_relButton",
			text: "[実況(Alt+" + String.fromCharCode(LIVE_TOGGLE_KEY) + ")]",
			title: (RELOAD_INTERVAL_LIVE / 1000) + "秒毎のリロード + スクロール",
			css: {
				cursor: "pointer",
				display: "inline-block"
			},
			click: function() {
				liveMode();
			}
		});
		// 通知ボタン
		var $notificationButton = $("<a>", {
			id: "GM_FAR_notificationButton",
			text: "[通知]",
			title: "新着レスのポップアップ通知",
			css: {
				cursor: "pointer",
				display: "inline-block"
			},
			click: function() {
				toggleNotification();
			}
		});
		if (isNotificationEnable) {
			$notificationButton.css("background-color", "#a9d8ff");
		}

		var $input = $("input[name$='email']");	//KOSHIAN 返信フォームを固定に合わせて位置変更
		$input.after($notificationButton);
		$input.after($liveButton);
		if(SHOW_NORMAL_BUTTON){
			$input.after($normalButton);
		}

		//実況モードトグルショートカットキー
		window.addEventListener("keydown",function(e) {
			if ( e.altKey && e.keyCode == LIVE_TOGGLE_KEY ) {
				liveMode();
			}
		}, false);

		/*
		 * 通常モード切り替え
		 */
		function normalMode() {
			if(normal_flag) {
				clearNormalReload();
				$normalButton.css("background" , "none");
				normal_flag = false;
			} else {
				setNormalReload();
				$normalButton.css("background-color" , "#ea8");
				normal_flag = true;
			}

		}

		/*
		 * 実況モード
		 * 呼出ごとにON/OFFトグル
		 */
		function liveMode() {
			if (!live_flag) {
				//実況モード時リロード
				timerLiveReload = setInterval(rel_scroll, RELOAD_INTERVAL_LIVE);
				//自動スクロール
				timerLiveScroll = setInterval(live_scroll, LIVE_SCROLL_INTERVAL);
				$liveButton.css("backgroundColor", "#ffa5f0");
				//startspin();	//未実装
				console.log(script_name + ": Start live mode @" + url);
				live_flag = true;
			} else {
				clearInterval(timerLiveReload);
				clearInterval(timerLiveScroll);
				$liveButton.css("background", "none");
				//stopspin();		//未実装
				console.log(script_name + ": Stop live mode @" + url);
				live_flag = false;
			}

			//新着スクロール
			function rel_scroll() {
				$('html, body').animate(
					{scrollTop:window.scrollMaxY},"fast"
				);
				if(isAkahukuNotFound()){
					//404時
					liveMode();
				}
				else {
					clickrelbutton();
				}
			}

			function live_scroll() {
				window.scrollBy( 0, LIVE_SCROLL_SPEED );
			}
			function startspin() {
				$("#akahuku_throp_menu_opener").css(
					"animation", "spin 2s infinite steps(8)"
				);
			}
			function stopspin() {
				$("#akahuku_throp_menu_opener").css(
					"animation", "none"
				);
			}
		}
		/*
		 * 通知切り替え
		 */
		function toggleNotification() {
			if(isNotificationEnable) {
				$notificationButton.css("background" , "none");
				isNotificationEnable = false;
			} else {
				Notification.requestPermission(function(result) {
					if (result == "denied") {
						$notificationButton.attr("title",
							"通知はFirefoxの設定でブロックされています\n" +
							"ロケーションバー(URL)の左のアイコンをクリックして\n" +
							"「サイトからの通知の表示」を「許可」に設定してください");
						return;
					} else if (result == "default") {
						console.log("default");
						return;
					}
					$notificationButton.attr("title", "新着レスのポップアップ通知");
					$notificationButton.css("background-color" , "#a9d8ff");
					isNotificationEnable = true;
				});
			}

		}
	}


	/*
	 * 新着レスをリセット
	 */
	function reset_title() {
		//ページ末尾でホイールダウンした時
		window.addEventListener("DOMMouseScroll",function scroll(event) {
			var window_y = Math.ceil(window.scrollY);	//Windowsで拡大率使用時に小数点以下でずれる対応
			var window_ymax = window.scrollMaxY;
			//console.log(script_name + ": window y,yamx: " + window_y +',' + window_ymax);
			if (event.detail > 0 && window_y >= window_ymax ) {
				reset_titlename();
			}
			return;
		} ,false);
		//F5キー押された時
		window.addEventListener("keydown",function(e) {
			if ( e.keyCode == "116" ) {
				reset_titlename();
			}
		}, false);

		function reset_titlename() {
			res = 0;
			var title_char = title_name();
			document.title = title_char;
		}
	}

	function rel() {
		//soudane();
		setTimeout(changetitle2, 1000);
		if(isAkahukuNotFound()){
			//404時
			clearNormalReload();
			changetitle();
			if (!isWindowActive && NOTIFY_THREAD_NOT_FOUND) {
				var popupText = "スレは落ちています\r\n自動更新を停止しました";
				showNotification(popupText);
			}
			if (USE_SAVE_MHT) {
				//saveMHT();	//未実装
			}
			console.log(script_name + ": Page not found, Stop auto reloading @" + url);
		}
		else {
			clickrelbutton();
		}
	}
	
	/**
	 * KOSHIANの［リロード］ボタンをクリック
	 */
	function clickrelbutton() {
		var relbutton = $("#contres > a").get(0);	//KOSHIANの[リロード]ボタン取得
		if(relbutton){
			var e = document.createEvent("MouseEvents");
			e.initEvent("click", false, true);
			relbutton.dispatchEvent(e);
		}
		/*
		setTimeout(function(){
			if (!isWindowActive && isNotificationEnable) {
				getNewResContent();
			}
		}, 1000);
		*/
	}
	/**
	 * MHTで保存
	 */
	function saveMHT() {
		var saveMHTButton = $("#akahuku_throp_savemht_button").get(0);
		if (saveMHTButton) {
			var e = document.createEvent("MouseEvents");
			e.initEvent("click", false, true);
			saveMHTButton.dispatchEvent(e);
		}
	}
	/*
	 * そうだねの数に応じてレスを着色
	 */
	function soudane() {
		if ( USE_SOUDANE ) {
			$("td > .sod").each(function(){
				var sodnum = $(this).text().match(/\d+/);
				if (sodnum){
					var col = "rgb(180, 240," + (Math.round(10 * sodnum + 180)) + ")";
					$(this).parent().css("background-color", col);
				}
			});
		}
	}

	/*
	 * タブタイトルに新着レス数・スレ消滅状態を表示
	 */
	function changetitle() {
		if ( USE_TITLE_NAME ) {
			var title_char = title_name();
			var newres = $("#KOSHIAN_NOTIFY").text().match(/新着レス:(\d+)/);	//KOSHIANの新着レス数取得
			if (isAkahukuNotFound()) {
				document.title = "#" + title_char;
			} else {
				if(newres) {
					res += parseInt(newres[1]);
				}
				if ( res !== 0) {
					document.title = "(" + res + ")" + title_char;
				}
			}
		}
	}
	/*
	 * タブタイトルにスレ消滅状態を表示
	 */
	function changetitle2() {
		if (USE_TITLE_NAME) {
			var title_char = title_name();
			if (isAkahukuNotFound()) {
				document.title = "#" + title_char;
			}
		}
	}
	// 新着レスの内容を取得
	function getNewResContent() {
		var $newrestable = $("#KOSHIAN_NOTIFY").nextAll('table');	//KOSHIAN新着レステーブル取得
		if ($newrestable.length) {
			var restexts = [];
			$newrestable.each(function() {
				var texts = [];
				$(this).find("blockquote").contents().each(function() {
					if ($(this).text() !== "") {
						texts.push($(this).text());
					}
				});
				restexts.push(texts.join("\r\n"));
			});
			var popupText = restexts.join("\r\n===============\r\n");
			showNotification(popupText);
		}
	}
	/*
	 * KOSHIANのステータスからスレ消滅状態をチェック
	 */
	function isAkahukuNotFound() {
		var statustext = $("#KOSHIAN_NOTIFY").text();
		if (statustext.match(/CODE:404/)) {
			return true;
		}
		else {
			return false;
		}
	}

	function title_name() {
		var title = document.title;
		var title_num = title.match(/^(#|\(\d+\))/);
		var title_num_length;
		if(!title_num){
			title_num_length = 0;
		}
		else {
			title_num_length = title_num[0].length;
		}
		var act_title_name = title.substr(title_num_length);
		return act_title_name;
	}

	function makeFormClearButton() {
		if ( USE_CLEAR_BUTTON ) {
			var $formClearButton = $("<div>", {
				id: "formClearButton",
				text: "[クリア]",
				css: {
					cursor: "pointer",
					margin: "0 5px"
				},
				click: function() {
					clearForm();
				}
			});
			var $comeTd = $(".ftdc b:contains('コメント')");
			$comeTd.after($formClearButton);
		}

		function clearForm() {
			$("#ftxa").val("");
		}
	}
	function addCss() {
		GM_addStyle(
			"@keyframes spin {" +
			"  0% { transform: rotate(0deg); }" +
			"  100% { transform: rotate(359deg); }" +
			"}"
		);
	}
	//タブのアクティブ状態を取得
	function setWindowFocusEvent() {
		$(window).focus();
		$(window).bind("focus", function() {
			//タブアクティブ時
			isWindowActive = true;
		}).bind("blur", function() {
			//タブ非アクティブ時
			isWindowActive = false;
		});
	}
	//新着レスをポップアップでデスクトップ通知する
	function showNotification(body) {
		Notification.requestPermission();
		//ファビコンからアイコン取得
		var icon = $("head > link[rel='shortcut icon']").attr("href");
		if (icon == null) {
			icon = "https://www.2chan.net/favicon.ico";
		}
		var instance = new Notification(
			document.title, {
				body: body,
				icon: icon,
			}
		);
	}
	//タイトルに板名を追加する
	function set_title() {
		if ( USE_BOARD_NAME ) {
			if (boardName == "二次元裏") {
				boardName = serverName;
			}
			document.title = boardName + " " + document.title;
		}
	}

})(jQuery);
