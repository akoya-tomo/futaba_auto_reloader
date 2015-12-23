
## なにコレ
[Greasemonkey](https://addons.mozilla.org/ja/firefox/addon/greasemonkey/)上で動くUserscriptです  
ふたば☆ちゃんねるのスレを開いている間新着レスを自動で取得し続けます  
※このUserscriptは[赤福Firefox SP](http://toshiakisp.github.io/akahuku-firefox-sp/)の機能を使用しているためFirefox専用となります  

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

## 注意事項
※このUserscriptはFirefoxで[赤福Firefox SP](http://toshiakisp.github.io/akahuku-firefox-sp/)をインストールしている事が前提となります

赤福の設定から  
<del>　「続きを読む」 → 「リロードの代わりに続きを読む」  </del>
<del>を有効にした状態で使用してください(赤福の「同期する」機能は処理が重たいため無効を推奨します)  </del>(v1.6で赤福の続きを読むの設定を変更する必要がなくなりました)

「フォーム」→「フォームを固定」を有効にすることをおすすめします(実況モード時は自動スクロールするため)  

## 更新履歴

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
