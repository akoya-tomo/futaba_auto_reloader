## futaba auto reloader K
このUserscriptは[himuro\_majika](https://github.com/himuro-majika)氏の[futaba auto reloader](https://github.com/himuro-majika/futaba_auto_reloader)をアドオン無しや[KOSHIAN リロード拡張](https://addons.mozilla.org/ja/firefox/addon/koshian-reload-futaba/)・[KOSHIAN リロード拡張 改](https://github.com/akoya-tomo/koshian_reload_futaba_kai)でも動作するように改変したものです。  
ふたば☆ちゃんねるのスレを開いている間新着レスを自動で取得し続けます。  

Firefoxの場合、[Tampermonkey](https://addons.mozilla.org/ja/firefox/addon/tampermonkey/)を先にインスールしてからスクリプトをインストールして下さい。  
(GreasemonkeyやViolentmonkeyでの動作は未確認です)  
Chromeの場合、[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)を先にインスールしてからスクリプトをインストールして下さい。  

※このUserscriptは単体で利用可能ですが、Firefoxアドオン[KOSHIAN リロード拡張](https://addons.mozilla.org/ja/firefox/addon/koshian-reload-futaba/)・[KOSHIAN リロード拡張 改](https://github.com/akoya-tomo/koshian_reload_futaba_kai)・[赤福Extended・赤福Firefox sp](http://toshiakisp.github.io/akahuku-firefox-sp/)と併用することができます。Chromeアドオン[ふたクロ](http://futakuro.com/)との併用では動作しません。  
※その他のふたば閲覧支援ツールは[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki/)。


## 機能
* 自動更新(1分毎にリロード)
* 実況モード(デフォルト5秒毎にリロード+スクロール)  
  Alt + L(デフォルト)でON/OFFできます。
* 新着レス数およびスレ消滅状態をタブのタイトルに表示  
  他のタブを見ていても新着レスがあるかスレが消えたかが分かります。  
  ページ末尾でホイールダウンするとリセットできます。  
* そうだねが付いてるレスをハイライト表示(そうだねが多いとだんだんソーダ色になります)
* レスフォームのコメント欄を消去するボタンを追加
* 各機能のカスタマイズはソースを参照
* 新着レスをポップアップで通知  
  スレを表示していない時に新着レスがあるとポップアップで表示されます。  

**追加機能**  

* 板名をタブのタイトルに表示（デフォルト：有効）  
* スレ消滅をポップアップで通知（デフォルト：無効）  
  スレが落ちたときにポップアップで表示されます。  
  設定を有効にすると通知ボタンのオンオフと関係無くスレ消滅が通知されます。  
* タイトルのスレ消滅表示をリセット操作で消さない（デフォルト：無効）  
  ページ下端でのホイールダウンなどのリセット操作でスレ消滅表示が消えなくなります。  
  スレ消滅に気付かずに閲覧中にホイールダウンしてスレ消滅表示を消してしまうことを防ぎます。  

## インストール
[GreasyFork](https://greasyfork.org/ja/scripts/36235-futaba-auto-reloader-k)　
[GitHub](https://github.com/akoya-tomo/futaba_auto_reloader_K/raw/master/futaba_auto_reloader.user.js)


## 注意事項
* 返信フォームを固定するアドオン（[KOSHIAN 返信フォームを固定](https://addons.mozilla.org/ja/firefox/addon/koshian-float-form/)・[KOSHIAN 返信フォームを固定 改](https://github.com/akoya-tomo/koshian_float_form_kai/)・[赤福Extended・赤福Firefox sp](http://toshiakisp.github.io/akahuku-firefox-sp/)）または返信フォームを固定するスタイルシートを使用することをおすすめします。  
(実況モード時は自動スクロールするため)  

**アドオンの設定に関して**

* KOSHIAN リロード拡張（改）の設定から
  - 「デフォルトの［リロード］ボタンを置き換える」を有効にした状態で使用してください。  
    KOSHIAN リロード拡張 改 v2.2.1以降は設定不要です。  

* 赤福の設定から  
  - 「続きを読む」→ 「続きを読む」を有効にした状態で使用してください。  

**通知機能に関して**

*  [通知]ボタンをクリックした際に初回のみ「このサイトからの通知を表示しますか？」と確認が出るので  
	 **「常に通知を表示する」**  
	 を選択してください。  
*	「通知をブロックする」を選んだ場合その後確認は表示されないので後から通知を有効にするには  
	ロケーションバー(URLバー)の左のアイコンをクリックして  
	 **「サイトからの通知の表示」** を **「許可」**  
	 に設定してください。
* [KOSHIAN Favicon Changer](https://addons.mozilla.org/ja/firefox/addon/koshian-favicon-changer/)アドオン・[futaba favicon changer](https://greasyfork.org/ja/scripts/39342-futaba-favicon-changer/)スクリプトまたは[赤福Extended・赤福Firefox sp](http://toshiakisp.github.io/akahuku-firefox-sp/)がインストールされていると通知のアイコンがスレ画になります。  

**オリジナル版にあってこのUserscriptに無い機能について**

* ふたボードは非対応です。[futaba auto reloader](https://github.com/himuro-majika/futaba_auto_reloader)をご利用ください。  

## 更新履歴

* v1.7.1rev9 2019-10-06
  - KOSHIAN リロード拡張 改 使用時に実況モードでタブをバックグラウンドにするとスレの表示が一時的に消えることがある不具合を暫定的に修正
  - 実況モードスクロール幅のデフォルト値を 2px → 3px に変更
* v1.7.1rev8 2019-07-02
  - 操作ボタンとKOSHIAN 返信フォーム拡張 改のsageボタンの位置が入れ替わることがある不具合を修正
  - リロードの監視方法を修正
* v1.7.1rev7 2019-05-11
  - アドオン無しや赤福Extended・赤福Firefox spでも動作するように修正
* v1.7.1rev6 2018-06-14
  - スレ消滅時にポップアップで通知する設定を追加
  - タイトルのスレ消滅表示をリセット操作で消さない設定を追加
  - 新着レス数のカウント漏れを防ぐためカウント方法を変更
* v1.7.1rev5 2018-05-06
  - 返信フォームの幅を狭くしたときにボタンが途中で折り返される不具合を修正
* v1.7.1rev4 2018-05-03
  - KOSHIAN リロード拡張 改 v1.5.0で\[F5\]キーによる新着レスが取得できるようになったので、  
    オリジナル版futaba auto reloaderにあった\[F5\]キーで新着レス数をクリアする機能を復活
  - ホイールダウンの確認方法を修正
* v1.7.1rev3 2018-03-24
  - KOSHIAN フォーム拡張アドオンと併用すると誤動作する不具合修正
* v1.7.1rev2 2017-12-16
  - リロード時のエラーコードを新着レス数と誤認識する不具合修正
* v1.7.1rev1 2017-12-10
  - KOSHIAN リロード拡張アドオン用に改変
  - 板名をタブのタイトルに表示する機能を追加

***

以下、オリジナル版futaba\_auto\_reloaderの更新履歴  

* v1.7.1 2016-11-13
  - https対応
  - スレ消滅時にMHT保存(要スレ操作パネル)する隠しオプション追加
  - 細かな修正
* v1.7 2016-01-17
  - 新着レスのデスクトップ通知を追加しました
  - ボタンの文言を変更しました
  - 実況モード時にどこかでめどがります
* v1.6.1 2015-12-23
  - 軽微な修正
* v1.6 2015-12-23
  - リロードの方法を変更しました  
    赤福の設定から「リロードの代わりに続きを読む」を有効にする必要がなくなりました(有効のままでも問題ありません)
* v1.5 2015-11-03
  - 通常の1分毎のリロードをスレごとにON/OFFできるように  
    ※ソースの` SHOW_NORMAL_BUTTON `を `false`にすると[通常]ボタンを非表示にできます
  - Firefox40のフォームサイズの暫定対処を削除
* v1.4 2015-08-12
  - Firefox40におけるフォームのデフォルトスタイル変更に伴う書き込みフォームのレイアウト崩れに対応
* v1.3 2015-07-14
  - 実況モード切り替えショートカットキーを変更
* v1.2 2015-06-19
  - スレ消滅時に自動更新を停止
* v1.1 2015-06-12
  - 実況モード切り替えショートカットキー追加
  - F5キーで新着レスリセット
  - フォームクリアボタンを追加
  - アイコン追加
  - リファクタリング
