// ==UserScript==
// @name           futaba auto reloader k
// @namespace      https://github.com/akoya-tomo
// @description    ふたば☆ちゃんねるで自動更新しちゃう(実況モードもあるよ！)
// @author         akoya_tomo
// @include        http://*.2chan.net/*/res/*
// @include        https://*.2chan.net/*/res/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @version        1.7.1rev10
// @grant          GM_addStyle
// @license        MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAPUExURYv4i2PQYy2aLUe0R////zorx9oAAAAFdFJOU/////8A+7YOUwAAAElJREFUeNqUj1EOwDAIQoHn/c88bX+2fq0kRsAoUXVAfwzCttWsDWzw0kNVWd2tZ5K9gqmMZB8libt4pSg6YlO3RnTzyxePAAMAzqMDgTX8hYYAAAAASUVORK5CYII=
// @noframes
// ==/UserScript==
/* globals jQuery */

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
	var LIVE_SCROLL_SPEED = 3;						//実況モードスクロール幅[px]
	var LIVE_TOGGLE_KEY = "76";						//実況モードON・OFF切り替えキーコード(With Alt)
	var SHOW_NORMAL_BUTTON = true;				//通常モードボタンを表示する
	var USE_NOTIFICATION_DEFAULT = false;	// 新着レスの通知をデフォルトで有効にする
	var USE_SAVE_MHT = false;							// スレ消滅時にMHTで保存する（赤福のみ）
	var USE_BOARD_NAME = true;				//板名をタブに表示する
	var NOTIFY_THREAD_NOT_FOUND = false;	//スレの消滅を通知する（通知ボタンとは独立して動作）
	var KEEP_THREAD_NOT_FOUND_MARK = false;		//タイトルのスレ消滅表示をリセット操作で消さない（true = 消さない : false = 消す）
	var USE_SYNC_BUTTON = false;			//[同期]ボタンを使用する（赤福のみ）

	var res = 0;	//新着レス数
	var timerNormal, timerLiveReload, timerLiveScroll;
	var url = location.href;
	var script_name = "futaba_auto_reloader_k";
	var isWindowActive = true;	// タブのアクティブ状態
	var isNotificationEnable = USE_NOTIFICATION_DEFAULT;	// 通知の有効フラグ
	var serverName = document.domain.match(/^[^.]+/);
	var boardName = $("#tit").text().match(/^[^＠]+/);
	var resnum = $(".rtd").length;	// 総レス数
	var newres_index = resnum;	// リロード前の総レス数
	var normal_flag, live_flag;
	var rel_flag = false;

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
	check_akahuku_reload();
	check_futaba_reload();

	//通常リロード開始
	function setNormalReload() {
		timerNormal = setInterval(rel, RELOAD_INTERVAL_NORMAL);
		console.log(script_name + ": Start auto reloading @" + url);
	
		$(document).on("KOSHIAN_reload", () => {
			if (live_flag) {
				rel_flag = true;
			}
			checkNewRes();
		});

		$(document).on("KOSHIAN_reload_notfound", () => {
			stopAutoReloading();
		});

	}
	//通常リロード停止
	function clearNormalReload() {
		clearInterval(timerNormal);
		console.log(script_name + ": Stop auto reloading @" + url);
	}
	/*
	 * 新着レス確認
	 */
	function checkNewRes() {
		newres_index = resnum;
		resnum = $(".rtd").length;
		soudane();
		changetitle();
		if (!isWindowActive && isNotificationEnable) {
			getNewResContent();
		}
	}
	/*
	 * 自動リロード停止
	 */
	function stopAutoReloading() {
		clearNormalReload();
		changetitle();
		if (!isWindowActive && NOTIFY_THREAD_NOT_FOUND) {
			var popupText = "スレは落ちています\r\n自動更新を停止しました";
			showNotification(popupText);
		}
		console.log(script_name + ": Page not found, Stop auto reloading @" + url);
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
		normal_flag = true;	//通常モード有効フラグ
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

		live_flag = false;	//実況モード有効フラグ
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

		var $input = $("#KOSHIAN_form_sage_button").length ? $("#KOSHIAN_form_sage_button") : $("input[name$='email']");	// 「KOSHIAN 返信フォームを固定」に合わせて位置変更
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
				startspin();
				console.log(script_name + ": Start live mode @" + url);
				live_flag = true;
			} else {
				clearInterval(timerLiveReload);
				clearInterval(timerLiveScroll);
				$liveButton.css("background", "none");
				stopspin();
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
	 * ボタンを返信ボタンの横に移動（赤福用）
	 */
	function moveLiveButton() {
		var $input = $("input[value$='信する']");
		$("#GM_FAR_notificationButton").insertAfter($input);
		$("#GM_FAR_relButton_live").insertAfter($input);
		$("#GM_FAR_relButton_normal").insertAfter($input);
	}

	/*
	 * 新着レスをリセット
	 */
	function reset_title() {
		//ページ末尾でホイールダウンした時
		window.addEventListener("wheel", function(event){
			//Windowsで拡大率使用時にwindow_yが小数点以下でずれる対応
			var window_y = Math.ceil($(window).height() + $(window).scrollTop());
			var window_ymax = $(document).height();
			//console.log(script_name + ": window_y,yamx,deltaY: " + window_y +',' + window_ymax + ',' + event.deltaY);
			if (event.deltaY > 0 && window_y >= window_ymax && (!KEEP_THREAD_NOT_FOUND_MARK || !isAkahukuNotFound())) {
				reset_titlename();
			}
			return;
		}, false);
		//F5キー押された時
		window.addEventListener("keydown",function(e) {
			if ( e.keyCode == "116" && (!KEEP_THREAD_NOT_FOUND_MARK || !isAkahukuNotFound()) ) {
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
		//soudane();	//新着レス確認にて実行
		setTimeout(changetitle2, 1000);	//KOSHIAN リロード拡張対策
		if(isAkahukuNotFound()){
			//404時
			stopAutoReloading();
			if (USE_SAVE_MHT) {
				saveMHT();
			}
		}
		else {
			clickrelbutton();
		}
	}
	
	/**
	 * ［リロード］ボタンをクリック
	 */
	function clickrelbutton() {
		var syncbutton = $("#akahuku_reload_syncbutton").get(0);
		var relbutton = $("#akahuku_reload_button").get(0);
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", false, true);
		if(USE_SYNC_BUTTON && syncbutton && !live_flag) {
			// 赤福の[同期]ボタン（除く実況モード）
			syncbutton.dispatchEvent(e);
		} else if(relbutton){
			// 赤福の[続きを読む]ボタン
			relbutton.dispatchEvent(e);
		} else {
			// ふたば or KOSHIANの[リロード]ボタン
			relbutton = $("#contres > a").get(0);
			if(relbutton){
				relbutton.dispatchEvent(e);
			}
		}
		/* リロード完了を検出してから新着レスを確認するように変更
		setTimeout(function(){
			if (!isWindowActive && isNotificationEnable) {
				getNewResContent();
			}
		}, 1000);
		*/
	}
	/**
	 * 赤福の動的リロードの状態を取得
	 */
	function check_akahuku_reload() {
		var target = $("#akahuku_reload_status").get(0);
		if (target) {
			setAkahukuReloadObserver(target);
			moveLiveButton();
		} else {
			$(document).on("AkahukuContentApplied", () => {
				target = $("#akahuku_reload_status").get(0);
				if (target) {
					setAkahukuReloadObserver(target);
					moveLiveButton();
				} else {
					console.error (script_name + " - #akahuku_reload_status not found");
				}
			});
		}
		function setAkahukuReloadObserver(target) {
			var status = "";
			var config = { childList: true };
			var observer = new MutationObserver(function() {
				if (target.textContent == status) {
					return;
				}
				status = target.textContent;
				if (status.indexOf("新着") === 0) {
					checkNewRes();
				} else if (status.indexOf("No") === 0 || status.indexOf("Mot") === 0) {
					stopAutoReloading();
					if (USE_SAVE_MHT) {
						saveMHT();
					}
				}
			});
			observer.observe(target, config);
		}
	}
	/**
	 * ふたばの動的リロードの状態を取得
	 */
	function check_futaba_reload() {
		var contdisp = $("#contdisp").get(0);
		if (contdisp) {
			setFutabaReloadObserver(contdisp);
		}
		function setFutabaReloadObserver(target) {
			var status = "";
			var reloading = false;
			var config = { childList: true };
			var observer = new MutationObserver(function() {
				if (target.textContent == status) {
					return;
				}
				status = target.textContent;
				if (status == "・・・") {
					reloading = true;
				} else if (reloading && status.endsWith("頃消えます")) {
					checkNewRes();
					reloading = false;
				} else if (status == "スレッドがありません") {
					stopAutoReloading();
					reloading = false;
				} else {
					reloading = false;
				}
			});
			observer.observe(target, config);
		}
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
				} else {
					$(this).parent().css("background-color", "");
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
			var newres = Math.max(resnum - newres_index, 0);
			if (isAkahukuNotFound()) {
				document.title = "#" + title_char;
			} else {
				if(newres) {
					res += newres;
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
		if (resnum > newres_index) {
			var $newrestable = $(".rtd").slice(newres_index);
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
	}
	/*
	 * ステータスからスレ消滅状態をチェック
	 */
	function isAkahukuNotFound() {
		var statustext = null;
		// KOSHIAN
		var $status = $("#KOSHIAN_NOTIFY");
		if ($status.length) {
			statustext = $status.text();
			if (statustext.match(/CODE:404/)) {
				return true;
			} else {
				//return false	// KOSHIAN 返信フォーム拡張（改）が#KOSHIAN_NOTIFYを書き込むので、ここではreturnしない
			}
		}
		// 赤福
		$status = $("#akahuku_reload_status");
		if ($status.length) {
			statustext = $status.text();
			if (statustext.match(/(No Future)|((M|N)ot Found)/)) {
				return true;
			}
			else {
				return false;
			}
		} else {
			// ふたば
			$status = $("#contdisp");
			if ($status.length) {
				statustext = $status.text();
				if (statustext == "スレッドがありません") {
					return true;
				}
				else {
					return false;
				}
			}
		}
		return false;
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
			if (live_flag && rel_flag) {
				//実況モードかつKOSHIAN改がリロードしていたらリロードして実況モードのタイマーをリセット
				clickrelbutton();
				$("#GM_FAR_relButton_live").click();
				setTimeout(() => {
					$("#GM_FAR_relButton_live").click();
				}, 100);
			}
			rel_flag = false;
		}).bind("blur", function() {
			//タブ非アクティブ時
			isWindowActive = false;
		});
	}
	//新着レスをポップアップでデスクトップ通知する
	function showNotification(body) {
		Notification.requestPermission();
		//ファビコンからアイコン取得
		var	icon = $("head > link[rel*='icon']").attr("href");
		if (!icon) {
			icon = "/favicon.ico";
		}
		var instance = new Notification(
			document.title, {
				body: body,
				icon: icon,
			}
		);
		instance.onclick = (e) => {
			window.focus();
			e.target.close();
		};
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
