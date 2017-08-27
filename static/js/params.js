"use strict";

const parameters = [
	["角度 Z", "PARAM_ANGLE_Z", -30.0, 0.0, 30.0, "+で画面の右を向く"],
	["角度 X", "PARAM_ANGLE_X", -30.0, 0.0, 30.0, "+で画面の右を向く"],
	["角度 Y", "PARAM_ANGLE_Y", -30.0, 0.0, 30.0, "+で画面の上を向く"],
	["左目　開閉", "PARAM_EYE_L_OPEN", 0.0, 0.75, 1.5, "+で目を開ける"],
	["左目　笑顔", "PARAM_EYE_L_SMILE", 0.0, 0.0, 1.0, "+で笑顔目"],
	["右目　開閉", "PARAM_EYE_R_OPEN", 0.0, 0.75, 1.5, "+で目を開ける"],
	["右目　笑顔", "PARAM_EYE_R_SMILE", 0.0, 0.0, 1.0, "+で笑顔目"],
	["目玉 X", "PARAM_EYE_BALL_X", -1.0, 0.0, 1.0, "+で右を見る"],
	["目玉 Y", "PARAM_EYE_BALL_Y", -1.5, 0.0, 1.5, "+で上を見る"],
	["瞳ハイライト揺れ", "PARAM_EYE_HIGHLIGHT_SHAKE", -1.0, 0.0, 1.0, "瞳ハイライトの揺れ"],
	["瞳の縮小", "PARAM_EYE_BALL_SIZE", 0.0, 1.0, 1.0, "瞳の縮小"],
	["目変形", "PARAM_EYE_FORM", -2.0, 0.0, 2.0, "たれ目　⇔　つり目"],
	["特殊目切り替え", "PARAM_EYE_EX", 0.0, 0.0, 20.0, ""],
	["ハート目のON/OFF", "PARAM_PARAM_EYE_HEART_STATE", 0.0, 0.0, 1.0, ""],
	["瞳ハイライトのON/OFF", "PARAM_EYE_HIGHLIGHT_STATE", 0.0, 1.0, 1.0, ""],
	["涙目", "PARAM_EYE_WATERY", 0.0, 0.0, 1.0, ""],
	["目のクマ", "PARAM_EYE_KUMA", 0.0, 0.0, 1.0, ""],
	["目隠れ度", "PARAM_MEKAKURE", 0.0, 0.0, 1.0, ""],
	["髪の上に目を表示", "PARAM_EYE_OVERWRITE", 0.0, 0.0, 1.0, ""],
	["左眉　左右", "PARAM_BROW_L_X", -2.0, 0.0, 2.0, "-で眉を寄せる"],
	["左眉　上下", "PARAM_BROW_L_Y", -2.0, 0.0, 2.0, "+で眉を上げる"],
	["右眉　左右", "PARAM_BROW_R_X", -2.0, 0.0, 2.0, "-で眉を寄せる"],
	["右眉　上下", "PARAM_BROW_R_Y", -2.0, 0.0, 2.0, "+で眉を上げる"],
	["左眉　角度", "PARAM_BROW_L_ANGLE", -1.0, 0.0, 1.0, "-で眉を怒らせる"],
	["左眉　変形", "PARAM_BROW_L_FORM", -1.0, 0.0, 1.0, "-で眉を怒らせる"],
	["右眉　角度", "PARAM_BROW_R_ANGLE", -1.0, 0.0, 1.0, "-で眉を怒らせる"],
	["右眉　変形", "PARAM_BROW_R_FORM", -1.0, 0.0, 1.0, "-で眉を怒らせる"],
	["口　開閉", "PARAM_MOUTH_OPEN_Y", 0.0, 0.0, 1.0, "+で口を開く"],
	["口　変形", "PARAM_MOUTH_FORM", -1.0, 0.0, 1.0, "+で笑った口,-で怒った口"],
	["口の変形補助", "PARAM_MOUTH_AROUSAL", -1.0, 0.0, 1.0, "-で眠気　+で覚醒"],
	["舌出し", "PARAM_TONGUE", 0.0, 0.0, 1.0, ""],
	["口の高さ", "PARAM_MOUTH_HEIGHT", -1.0, 1.0, 1.0, ""],
	["舌の左右", "PARAM_TONGUE_SHAKE", -1.0, 0.0, 1.0, ""],
	["汗", "PARAM_SWEAT", 0.0, 0.0, 1.0, ""],
	["汗垂れ", "PARAM_SWEAT_FALL", 0.0, 0.0, 1.0, ""],
	["よだれ", "PARAM_DROOL", 0.0, 0.0, 1.0, ""],
	["照れ", "PARAM_CHEEK", 0.0, 0.25, 1.0, "+で頬染め"],
	["顔の影", "PARAM_FACE_SHADOW", -5.0, 0.0, 5.0, "偶数:無し 1:青 3:黒 -1:赤 "],
	["髪揺れ　前", "PARAM_HAIR_FRONT", -1.0, 0.0, 1.0, "+で画面の右に動く"],
	["前髪ふわ", "PARAM_HAIR_FRONT_FLOAT", 0.0, 0.0, 1.0, ""],
	["髪揺れ　横", "PARAM_HAIR_SIDE", -1.0, 0.0, 1.0, "+で画面の右に動く"],
	["横髪ふわ", "PARAM_HAIR_SIDE_FLOAT", 0.0, 0.0, 1.0, ""],
	["髪揺れ　後", "PARAM_HAIR_BACK", -1.0, 0.0, 1.0, "+で画面の右に動く"],
	["後ろ髪ふわ", "PARAM_HAIR_BACK_FLOAT", 0.0, 0.0, 1.0, ""],
	["髪揺れ　ついんて", "PARAM_HAIR_TWINTAIL_SHAKE", -1.0, 0.0, 1.0, ""],
	["ついんてふわ", "PARAM_HAIR_TWINTAIL_FLOAT", 0.0, 0.0, 1.0, ""],
	["アホ毛の揺れ", "PARAM_AHOGE_SHAKE", -1.0, 0.0, 1.0, ""],
	["包丁上下", "PARAM_KNIFE_SHAKE", -1.0, 0.0, 1.0, ""],
	["上体寄せ", "PARAM_BODY_APPROACH", -30.0, 0.0, 30.0, "上体の引き-手前寄せ"],
	["体の回転　Z", "PARAM_BODY_ANGLE_Z", -10.0, 0.0, 10.0, "+で画面の右に傾く"],
	["体の回転　X", "PARAM_BODY_ANGLE_X", -10.0, 0.0, 10.0, "+で画面の右を向く"],
	["体の回転　Y", "PARAM_BODY_ANGLE_Y", -10.0, 0.0, 10.0, "+で画面の上に動く"],
	["呼吸", "PARAM_BREATH", 0.0, 0.0, 1.0, "+で息を吸う"],
	["左腕X", "PARAM_ARM_L_X", 0.0, 0.0, 1.0, ""],
	["左腕Y", "PARAM_ARM_L_Y", -1.0, -1.0, 1.0, ""],
	["左手の変形", "PARAM_HAND_FORM_L", 0.0, 0.0, 20.0, ""],
	["左手首の角度", "PARAM_HAND_ANGLE_L", -30.0, 0.0, 30.0, ""],
	["右腕X", "PARAM_ARM_R_X", 0.0, 0.0, 1.0, ""],
	["右腕Y", "PARAM_ARM_R_Y", -1.0, -1.0, 1.0, ""],
	["右手の変形", "PARAM_HAND_FORM_R", 0.0, 0.0, 20.0, ""],
	["右手首の角度", "PARAM_HAND_ANGLE_R", -30.0, 0.0, 30.0, ""],
	["左足X", "PARAM_LEG_L_X", -1.0, 0.0, 1.0, ""],
	["左足Y", "PARAM_LEG_L_Y", -1.0, -1.0, 1.0, ""],
	["左足首の角度", "PARAM_FOOT_L_ANGLE", -20.0, 0.0, 20.0, ""],
	["右足X", "PARAM_LEG_R_X", -1.0, 0.0, 1.0, ""],
	["右足Y", "PARAM_LEG_R_Y", -1.0, -1.0, 1.0, ""],
	["右足首の角度", "PARAM_FOOT_R_ANGLE", -20.0, 0.0, 20.0, ""],
	["足の優先度", "PARAM_LEG_FRONT", -1.0, 0.0, 1.0, ""],
	["スカートの影有効化", "PARAM_SKIRTSHADOW", 0.0, 1.0, 1.0, ""],
	["スカートふわ", "PARAM_SKIRT_FLOAT", 0.0, 0.0, 1.0, ""],
	["スカート揺れ", "PARAM_SKIRT_SHAKE", -1.0, 0.0, 1.0, ""],
	["帯リボン揺れ", "PARAM_RIBBON_SHAKE", -1.0, 0.0, 1.0, ""],
	["帯リボン左揺れ", "PARAM_RIBBON_L_SHAKE", -1.0, 0.0, 1.0, ""],
	["帯リボン右揺れ", "PARAM_RIBBON_R_SHAKE", -1.0, 0.0, 1.0, ""],
	["帯リボン遊びふわ", "PARAM_RIBBON_FLOAT", 0.0, 0.0, 1.0, ""],
	["胸元アクセA揺れ", "PARAM_CHEST_ACCESSORY_A_SHAKE", -1.0, 0.0, 1.0, ""],
	["胸元アクセB揺れ", "PARAM_CHEST_ACCESSORY_B_SHAKE", -1.0, 0.0, 1.0, ""],
	["初期形状記憶用", "PARAM_DEFAULT_DEFORM", 0.0, 0.0, 1.0, ""],
	["体の向きと表情の対応", "PARAM_SWITCH_EXPRESSION", 0.0, 1.0, 1.0, ""],
	["きりたん砲表示切替", "PARAM_KIRITANHO_HIDE", 0.0, 0.0, 1.0, ""],
	["きりたん砲X", "PARAM_KIRITANHO_X", 0.0, 0.0, 1.0, ""],
	["きりたん砲Y", "PARAM_KIRITANHO_Y", -1.0, 0.0, 1.0, ""],
	["きりたん砲の角度", "PARAM_KIRITANHO_ROT1", -1.0, 0.0, 1.0, ""],
	["きりたん砲の角度対照", "PARAM_KIRITANHO_ROT2", -1.0, 0.05, 1.0, ""],
	["きりたん砲のパース", "PARAM_KIRITANHO_PERSPECTIVE", -1.0, 0.0, 1.0, ""],
	["両胸揺れ_横", "PARAM_BREAST_SHAKE_LR_X", -1.0, 0.0, 1.0, ""],
	["両胸揺れ_縦", "PARAM_BREAST_SHAKE_LR_Y", -1.0, 0.0, 1.0, ""],
	["左前袖ふわ", "PARAM_SLEEVE_L2_FLOAT", 0.0, 0.0, 1.0, ""],
	["左前袖揺れ", "PARAM_SLEEVE_L2_SHAKE", -1.0, 0.0, 1.0, ""],
	["右前袖ふわ", "PARAM_SLEEVE_R2_FLOAT", 0.0, 0.0, 1.0, ""],
	["右前袖揺れ", "PARAM_SLEEVE_R2_SHAKE", -1.0, 0.0, 1.0, ""],
];

const table = document.querySelector("table");
table.addEventListener("mousedown", e => e.stopPropagation());
table.addEventListener("touchstart", e => e.stopPropagation());

table.innerHTML = parameters.map(p => {
	const [name, key, min, def, max, desc] = p;
	const step = Math.round((max - min) / 360 * 1000) / 1000;
	return `
		<tr>
			<th>${name}</th>
			<td>
				<input type="range" id="${key}" title="${desc}" value="${def}" min="${min}" max="${max}" step="${step}">
			</td>
		</tr>
	`;
}).join("");

let params = [];
window.Params = {get: _ => params};

const freeze = _ => params = Array.from(document.querySelectorAll("[type='range']"), p => [p.id, p.value]);
const sync = _ => params.forEach(p => document.querySelector(`#${p[0]}`).value = p[1]);
const reset = _ => {
	params = parameters.map(p => [p[1], p[3]]);
	sync();
};
fetch("/params.json").then(resp => resp.json()).then(p => {
	params = p;
	sync();
});

document.querySelectorAll("[type='range']").forEach(p => {
	p.addEventListener("input", freeze);
});
