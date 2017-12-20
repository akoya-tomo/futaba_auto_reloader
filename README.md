## こしあんでもオートリロードがしたい！
このUserscriptは[himuro\_majika](https://github.com/himuro-majika)氏の[futaba auto reloader](https://github.com/himuro-majika/futaba_auto_reloader)を[KOSHIAN リロード拡張](https://addons.mozilla.org/ja/firefox/addon/koshian-reload-futaba/)アドオン用に改変したものです  
[Tampermonkey](https://addons.mozilla.org/ja/firefox/addon/tampermonkey/)アドオンをインストールしてからこのスクリプトをインストールしてください  

ふたば☆ちゃんねるのスレを開いている間新着レスを自動で取得し続けます  
※このUserscriptは[KOSHIAN リロード拡張](https://addons.mozilla.org/ja/firefox/addon/koshian-reload-futaba/)アドオンの機能を使用しているためFirefox専用となります  

※このスクリプトにも使えるKOSHIAN リロード拡張の改変版は[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki)の一覧からどうぞ


## 機能
* 自動更新(1分毎にリロード)
* 実況モード(デフォルト5秒毎にリロード+スクロール)  
  Alt + L(デフォルト)でON/OFFできます
* 新着レス数およびスレ消滅状態をタブのタイトルに表示  
 他のタブを見ていても新着レスがあるかスレが消えたかが分かります  
 ページ末尾でホイールダウン(またはF5キー押下)するとリセットできます  
* そうだねが付いてるレスをハイライト表示(そうだねが多いとだんだんソーダ色になります)
* レスフォームのコメント欄を消去するボタンを追加
* 各機能のカスタマイズはソースを参照
* (v1.7)新着レスをポップアップで通知  
  スレを表示していない時に新着レスがあるとポップアップで表示されます
* (rev1)板名をタブのタイトルに表示


## インストール
[GreasyFork](https://greasyfork.org/ja/scripts/36235-futaba-auto-reloader-k)　
[GitHub](https://github.com/akoya-tomo/futaba_auto_reloader_K/raw/master/futaba_auto_reloader.user.js)


## 注意事項
※このUserscriptはFirefoxで[KOSHIAN リロード拡張](https://addons.mozilla.org/ja/firefox/addon/koshian-reload-futaba/)アドオンをインストールしている事が前提となります

アドオンの設定に関して

* KOSHIAN リロード拡張の設定から **「デフォルトの［リロード］ボタンを置き換える」** を **有効** にした状態で使用してください  
* [KOSHIAN 返信フォームを固定](https://addons.mozilla.org/ja/firefox/addon/koshian-float-form/)アドオンを使用することをおすすめします(実況モード時は自動スクロールするため)  
* [KOSHIAN Favicon Changer](https://addons.mozilla.org/ja/firefox/addon/koshian-favicon-changer/)アドオンがインストールされていると通知のアイコンがスレ画になります  

通知機能に関して

*  [通知]ボタンをクリックした際に初回のみ「このサイトからの通知を表示しますか？」と確認が出るので  
	 **「常に通知を表示する」**  
	 を選択してください  
*	「通知をブロックする」を選んだ場合その後確認は表示されないので後から通知を有効にするには  
	ロケーションバー(URLバー)の左のアイコンをクリックして  
	 **「サイトからの通知の表示」** を **「許可」**  
	 に設定してください

オリジナル版にあってこのUserscriptに無い機能について

* ふたボードはKOSHIAN リロード拡張が動作しないため非対応です
* スレ消滅時にMHT保存する隠し機能がありません
* 実況モードON時の顔マーク回転がありません

## 更新履歴

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
