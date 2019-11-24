<?php

require_once('../MAS334.php');

$labels = parse_aux_labels();

$demos_json = <<<JSON
[
 ["subsets","Subsets",["prop-powset"]],
 ["choices","Ordered and unordered combinations",["prob-olympics"]],
 ["lottery","The National Lottery",["prob-lottery"]],
 ["expansion","The binomial expansion",["eg-expansion"]],
 ["pascal","Pascal's triangle",[]],
 ["addition","Pascal's identity",["prop-pascal-relation"]],
 ["complement","Complements",["prop-complement"]],
 ["grid_route","Grid routes",["prob-grid-route"]],
 ["equations","Counting solutions to some equations",["rem-equations"]],
 ["max_split","An extension of Pascal's identity",["prop-pascal-extended"]],
 ["triangle_sum","Sum of numbers in a triangle",["prop-triangle-sum"]],
 ["subtriangles","Counting subtriangles",["eg-subtriangles"]],
 ["circle_cutting","Lines across circles",["prop-circle-cuts"]],
 ["dominos","Covering a chess board with dominos",["prob-dominos"]],
 ["tetris","Tetris",["prob-tetris"]],
 ["bridges","The seven bridges of Königsberg",["prob-euler-circuit"]],
 ["hair","Numbers of hairs",["prob-hair"]],
 ["handshake","Handshaking",["prop-handshake"]],
 ["sum_set","Sums of subsets",["prob-sum-set"]],
 ["mod_sum","Modular sums",["prob-mod-sum"]],
 ["piggybank","Piggy bank",["prob-piggybank"]],
 ["venn2","Tennis and squash",["prob-venn-ii"]],
 ["venn3","Tennis, squash and badminton",["prob-venn-iii"]],
 ["derange4","Derangements of 1234",["prop-derange"]],
 ["derange5","Derangements of 12345",["prop-derange"]],
 ["fortytwo","Numbers coprime with 42",["prob-fortytwo"]],
 ["match","Matching problems",["eg-match"]],
 ["rooks","Basic rook problems",["prob-nicked-rooks","eg-empty-three","eg-rooks-misc"]],
 ["rook_perms","Rooks and permutations",["prop-rook-perms"]],
 ["full_board","Rook polynomial for the full board",["prop-full-board"]],
 ["rook_derange","Rooks and derangements",["prob-rook-derange"]],
 ["snap","Snap",["prob-snap"]],
 ["menage","Problème des ménages",["prob-menage"]],
 ["rook_split","Blocking and stripping",["thm-split"]],
 ["rook_factor","Factoring rook polynomials",["eg-rook-factor"]],
 ["extend","Extending a latin square",["prob-extend"]],
 ["solve_menage","Solving the Problème des ménages",["eg-solve-menage"]],
 ["snap_sympy","Solving the Snap problem with Python",["eg-snap-finish"]],
 ["SX","Counting the sets \$S_X\$",["lem-SX"]],
 ["staircase","Staircase",["prop-staircase"]],
 ["rugby","The Rugby World Cup",[]],
 ["consistent","A consistent tournament",["eg-consistent"]],
 ["modular","Odd modular tournament",["eg-odd-modular"]],
 ["big_latin","A big Latin square",[]],
 ["d8_latin","Latin square for the dihedral group \$D_8\$",["eg-latin-group"]],
 ["mod_latin","Latin square for addition mod \$10\$",["eg-latin-mod"]],
 ["affine_design","Affine plane design over \$\\\\mathbb{Z}/3\$",["eg-affine-design"]],
 ["quadratic_design","Quadratic residue design over \$\\\\mathbb{Z}/7\$",["eg-residue-seven"]]
]
JSON;

$demos0 = json_decode($demos_json);

$demos = array();

foreach($demos0 as $d0) {
 $d = new stdClass();
 $demos[] = $d;
 $d->name = $d0[0];
 $d->title = $d0[1];
 $d->refs = array();
 foreach($d0[2] as $label) {
  $d->refs[] = $labels[$label];
 }
 $d->ref_string = implode(', ', $d->refs);
 $d->html = <<<HTML
 <tr>
  <td width="300px"><a href="{$d->name}.html">{$d->title}</a></td>
  <td width="250px">{$d->ref_string}</td>
 </tr>

HTML;
}

$num_demos = count($demos);
$num_rows = ceil($num_demos / 2);

echo <<<HTML

<html>
 <head>
  <style type="text/css" media="screen">
   @import url(MAS334_demo.css);
   
   table#A {
    position: absolute;
    left: 50px;
    top: 70px;
   }
   
   table#B {
    position: absolute;
    left: 680px;
    top: 70px;
   }
     
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js"> 
   MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    jax: ["input/TeX","output/HTML-CSS"],
    tex2jax: {inlineMath: [["$","$"]]}
   });
  </script> 
 </head>
 <body>
  <div id="frame">
   <div  style="margin-left:50px;">
    <h1>Interactive pages for Combinatorics</h1>
    <table id="A" class="edged">

HTML;

$i = 0;
while ($i < $num_rows) { echo $demos[$i]->html; $i++; }

echo <<<HTML
    </table>
    <table id ="B" class="edged">

HTML;

while ($i < $num_demos) { echo $demos[$i]->html; $i++; }

echo <<<HTML
    </table>
   </div>
  </div>
 </body>
</html>

HTML;
