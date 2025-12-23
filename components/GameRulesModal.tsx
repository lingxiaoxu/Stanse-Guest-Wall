
import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Swords, ShieldAlert, Skull, Wine, Repeat, UserMinus } from 'lucide-react';
import { Language } from '../constants';

interface GameRulesModalProps {
  onClose: () => void;
  lang: Language;
}

type RuleSection = {
  title: string;
  subtitle: string;
  items?: { label: string; value: string; note: string }[];
  content?: React.ReactNode;
  intro?: React.ReactNode;
};

type CheatsheetItem = {
  title: string;
  content: React.ReactNode;
};

const CONTENT: Record<Language, {
  mainTitle: string;
  manualSubtitle: string;
  sections: {
    setup: RuleSection;
    circle: RuleSection;
    mirror: RuleSection;
    hierarchy: RuleSection;
    punishment: RuleSection;
    exchange: RuleSection;
  };
  hierarchyItems: {
    lv4: { label: string; name: string; desc: string };
    lv3: { label: string; name: string; desc: string };
    lv2: { label: string; name: string; desc: string };
    lv1: { label: string; name: string; desc: string };
  };
  cheatsheet: {
    title: React.ReactNode;
    subtitle: string;
    items: {
      circle: CheatsheetItem;
      mirror: CheatsheetItem;
      hierarchy: CheatsheetItem;
      punishment: CheatsheetItem;
    };
    footer: React.ReactNode;
  };
}> = {
  zh: {
    mainTitle: "扑克大乱斗",
    manualSubtitle: "官方游戏手册 v1.0",
    sections: {
      setup: {
        title: "基础设置",
        subtitle: "Base Setup",
        items: [
          { label: "总兵力", value: "52 张", note: "(无大小王)" },
          { label: "公共牌库", value: "12 张", note: "(管理员 Lingxiao 保管)" },
          { label: "玩家", value: "40 人", note: "(单兵或组队)" },
        ]
      },
      circle: {
        title: "点数循环",
        subtitle: "Circle of Death",
        content: (
            <>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-ig-pink shrink-0 mt-1" />
                    <div>
                        <h4 className="text-white font-bold">特殊克制 (The Reversal)</h4>
                        <p className="text-sm text-gray-400 mt-1">虽然 2 最小，但 <strong className="text-white">2 &gt; A</strong>。</p>
                        <p className="text-xs text-gray-500 mt-1">总结：A 是霸主，只有 2 能杀 A；除了 A 以外，其他数字谁都能杀 2。</p>
                    </div>
                </div>
            </>
        )
      },
      mirror: {
        title: "宿命单挑",
        subtitle: "1v1 Mirror Match",
        content: (
             <div className="space-y-2">
                <p className="text-gray-300">触发条件：当你遇到持 <strong className="text-white border-b border-white/20">点数相同</strong> 的对手 (比如红桃8 vs 黑桃8)。</p>
                <p className="text-gray-300">决斗方式：由于无法通过卡牌分胜负，必须通过 <strong className="text-ig-pink">外部游戏</strong> 一决高下 (推荐：掷骰子、猜拳、瞪眼比赛)。</p>
                <p className="text-xs text-gray-500 bg-white/5 inline-block px-2 py-1 rounded">输家接受战败惩罚。</p>
            </div>
        )
      },
      hierarchy: { 
          title: "组队等级", 
          subtitle: "Hierarchy",
          intro: (
              <div className="bg-white/5 border-l-4 border-ig-pink p-4 mb-6">
                  <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                      <UserMinus className="w-4 h-4 text-ig-pink" />
                      狩猎法则 (Team Hunting)
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                      组队玩家可以找落单的人（单兵）。落单者直接判负，必须接受惩罚：
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-400 mt-2 space-y-1">
                      <li><strong className="text-white">喝酒</strong>（一口或一杯）</li>
                      <li>或者找 Henry 抽<strong className="text-white">「真心话卡」</strong></li>
                  </ul>
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                      #YouLieYouDrink (回答问题或拒答喝双倍)
                  </p>
              </div>
          )
      },
      punishment: { 
          title: "战败惩罚", 
          subtitle: "Punishment",
          content: (
            <>
                <h4 className="text-red-400 text-xs uppercase tracking-widest mb-4">输家二选一 (Choose One)</h4>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                        <Wine className="w-5 h-5 text-white" />
                        <span className="text-gray-300">喝酒（一口或一杯）。</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Skull className="w-5 h-5 text-white" />
                        <span className="text-gray-300">
                            找 <strong className="text-white">Henry</strong> 抽「真心话卡」<br/>
                            <span className="text-xs text-red-400">#YouLieYouDrink (回答问题或拒答喝双倍)</span>
                        </span>
                    </li>
                </ul>
            </>
          )
      },
      exchange: { 
          title: "换牌机制", 
          subtitle: "Exchange",
          content: (
            <div>
                <p className="text-gray-300 mb-2">对牌型不满意？想凑炸弹？<br/>前往 <strong className="text-white">Lingxiao</strong> 处。</p>
                <div className="bg-blue-500/20 px-3 py-2 inline-block rounded text-blue-300 font-bold text-sm">
                    代价: 喝 1 个 Shot = 换一次牌
                </div>
                <p className="text-xs text-gray-500 mt-2">支持无限次重抽，直到满意为止。</p>
            </div>
          )
      },
    },
    hierarchyItems: {
        lv4: { label: "Lv.4 MAX", name: "四张 (Four of a Kind)", desc: "4张点数相同的牌。无视花色，碾压一切低级阵型。" },
        lv3: { label: "Lv.3 GOLD", name: "同花顺 (Straight Flush)", desc: "3张及以上，同花色且数字连续 (如 ♥️3, ♥️4, ♥️5)。" },
        lv2: { label: "Lv.2 SILVER", name: "三张 (Three of a Kind)", desc: "3张点数相同的牌 (如 7, 7, 7)。" },
        lv1: { label: "Lv.1 BRONZE", name: "杂色顺子 (Mixed Straight)", desc: "3张及以上，数字连续但花色不同。仅克制单人。" }
    },
    cheatsheet: {
        title: <>作弊<br/>小抄</>,
        subtitle: "速查版规则",
        items: {
            circle: { 
                title: "核心循环", 
                content: <>
                    <p className="font-mono text-xs leading-tight font-medium break-all">
                        A&gt;K&gt;Q&gt;J&gt;10&gt;9&gt;8&gt;7&gt;6&gt;5&gt;4&gt;3<span className="text-ig-pink font-bold">&gt;2</span>
                    </p>
                    <p className="text-xs font-bold mt-1 bg-black text-white inline-block px-1">
                        注意: 2 &gt; A (头尾循环)
                    </p>
                </>
            },
            mirror: {
                title: "同号单挑",
                content: <p className="text-xs font-medium leading-relaxed">
                    点数相同 (比如红桃8 vs 黑桃8) = <span className="underline decoration-2">强制小游戏</span> (掷骰子/猜拳)。
                </p>
            },
            hierarchy: {
                title: "牌型压制",
                content: <ol className="text-xs font-bold space-y-1 list-decimal list-inside">
                    <li>四张 (4 Kind)</li>
                    <li>同花顺 (Straight Flush)</li>
                    <li>三张 (3 Kind)</li>
                    <li>杂色顺子 (Mixed Straight)</li>
                    <li className="font-normal text-red-600">落单 (遇到组队直接输!)</li>
                </ol>
            },
            punishment: {
                title: "输赢与换牌",
                content: <ul className="text-xs space-y-2">
                    <li className="flex gap-2">
                        <span className="font-bold">💀 输:</span>
                        <span className="leading-tight">喝酒 OR 真心话(找Henry)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">🔄 换:</span>
                        <span className="leading-tight">找Lingxiao, <br/>1 Shot = 无限换</span>
                    </li>
                </ul>
            }
        },
        footer: <>DON'T HATE THE PLAYER,<br/>HATE THE GAME.</>
    }
  },
  en: {
    mainTitle: "Poker Battle Royale",
    manualSubtitle: "Official Game Manual v1.0",
    sections: {
      setup: {
        title: "Basic Setup",
        subtitle: "Setup",
        items: [
          { label: "Total Troops", value: "52 Cards", note: "(No Jokers)" },
          { label: "Public Deck", value: "12 Cards", note: "(Keeper: Lingxiao)" },
          { label: "Players", value: "40 Max", note: "(Solo or Team)" },
        ]
      },
      circle: {
        title: "Circle of Death",
        subtitle: "Core Rules",
        content: (
            <>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-ig-pink shrink-0 mt-1" />
                    <div>
                        <h4 className="text-white font-bold">The Reversal</h4>
                        <p className="text-sm text-gray-400 mt-1">2 is the lowest, but <strong className="text-white">2 &gt; A</strong>.</p>
                        <p className="text-xs text-gray-500 mt-1">Summary: A is the boss, only 2 kills A; everyone else kills 2.</p>
                    </div>
                </div>
            </>
        )
      },
      mirror: {
        title: "1v1 Mirror Match",
        subtitle: "Duel",
        content: (
             <div className="space-y-2">
                <p className="text-gray-300">Trigger: When you meet an opponent with the <strong className="text-white border-b border-white/20">Same Rank</strong> (e.g. Heart 8 vs Spade 8).</p>
                <p className="text-gray-300">Duel: Since cards are equal, you must battle via <strong className="text-ig-pink">Mini Game</strong> (Dice, Rock-Paper-Scissors, Staring Contest).</p>
                <p className="text-xs text-gray-500 bg-white/5 inline-block px-2 py-1 rounded">Loser accepts punishment.</p>
            </div>
        )
      },
      hierarchy: { 
          title: "Team Hierarchy", 
          subtitle: "Ranks",
          intro: (
              <div className="bg-white/5 border-l-4 border-ig-pink p-4 mb-6">
                  <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                      <UserMinus className="w-4 h-4 text-ig-pink" />
                      Hunting Rule (Team vs Solo)
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                      Teams can hunt Solo players. Solo players automatically lose and must accept punishment:
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-400 mt-2 space-y-1">
                      <li><strong className="text-white">Drink</strong> (Sip or Shot)</li>
                      <li>OR Find Henry for a <strong className="text-white">"Truth Card"</strong></li>
                  </ul>
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                      #YouLieYouDrink (Answer or drink double)
                  </p>
              </div>
          )
      },
      punishment: { 
          title: "Punishment", 
          subtitle: "For Losers",
          content: (
            <>
                <h4 className="text-red-400 text-xs uppercase tracking-widest mb-4">Loser Options (Choose One)</h4>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                        <Wine className="w-5 h-5 text-white" />
                        <span className="text-gray-300">Drink (One sip or shot).</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Skull className="w-5 h-5 text-white" />
                        <span className="text-gray-300">
                            Find <strong className="text-white">Henry</strong> for a "Truth Card"<br/>
                            <span className="text-xs text-red-400">#YouLieYouDrink (Answer or drink double)</span>
                        </span>
                    </li>
                </ul>
            </>
          )
      },
      exchange: { 
          title: "Exchange", 
          subtitle: "Swap Cards",
          content: (
            <div>
                <p className="text-gray-300 mb-2">Don't like your hand? Want a bomb?<br/>Find <strong className="text-white">Lingxiao</strong>.</p>
                <div className="bg-blue-500/20 px-3 py-2 inline-block rounded text-blue-300 font-bold text-sm">
                    Cost: 1 Shot = 1 Exchange
                </div>
                <p className="text-xs text-gray-500 mt-2">Unlimited retries allowed.</p>
            </div>
          )
      },
    },
    hierarchyItems: {
        lv4: { label: "Lv.4 MAX", name: "Four of a Kind", desc: "4 cards of same rank. Ignores suit, crushes everything." },
        lv3: { label: "Lv.3 GOLD", name: "Straight Flush", desc: "3+ cards, same suit, sequential (e.g. ♥️3, ♥️4, ♥️5)." },
        lv2: { label: "Lv.2 SILVER", name: "Three of a Kind", desc: "3 cards of same rank (e.g. 7, 7, 7)." },
        lv1: { label: "Lv.1 BRONZE", name: "Mixed Straight", desc: "3+ cards, sequential but mixed suits. Only beats solo." }
    },
    cheatsheet: {
        title: <>CHEAT<br/>SHEET</>,
        subtitle: "Quick Rules",
        items: {
            circle: { 
                title: "Circle of Death", 
                content: <>
                    <p className="font-mono text-xs leading-tight font-medium break-all">
                        A&gt;K&gt;Q&gt;J&gt;10&gt;9&gt;8&gt;7&gt;6&gt;5&gt;4&gt;3<span className="text-ig-pink font-bold">&gt;2</span>
                    </p>
                    <p className="text-xs font-bold mt-1 bg-black text-white inline-block px-1">
                        Note: 2 &gt; A (Full Cycle)
                    </p>
                </>
            },
            mirror: {
                title: "Mirror Match",
                content: <p className="text-xs font-medium leading-relaxed">
                    Same Rank (e.g. ♥️8 vs ♠️8) = <span className="underline decoration-2">Mini Game</span> (Dice/RPS).
                </p>
            },
            hierarchy: {
                title: "Hierarchy",
                content: <ol className="text-xs font-bold space-y-1 list-decimal list-inside">
                    <li>Four of a Kind</li>
                    <li>Straight Flush</li>
                    <li>Three of a Kind</li>
                    <li>Mixed Straight</li>
                    <li className="font-normal text-red-600">Solo (Loses to Team!)</li>
                </ol>
            },
            punishment: {
                title: "Lose & Swap",
                content: <ul className="text-xs space-y-2">
                    <li className="flex gap-2">
                        <span className="font-bold">💀 Lose:</span>
                        <span className="leading-tight">Drink OR Truth (Henry)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">🔄 Swap:</span>
                        <span className="leading-tight">Find Lingxiao, <br/>1 Shot = Unlimited Swap</span>
                    </li>
                </ul>
            }
        },
        footer: <>DON'T HATE THE PLAYER,<br/>HATE THE GAME.</>
    }
  },
  ja: {
    mainTitle: "ポーカー・バトル",
    manualSubtitle: "公式ゲームマニュアル v1.0",
    sections: {
      setup: {
        title: "基本設定",
        subtitle: "Base Setup",
        items: [
          { label: "総兵力", value: "52 枚", note: "(ジョーカーなし)" },
          { label: "共有デッキ", value: "12 枚", note: "(管理者 Lingxiao)" },
          { label: "プレイヤー", value: "40 人", note: "(ソロまたはチーム)" },
        ]
      },
      circle: {
        title: "強さの順序",
        subtitle: "Circle of Death",
        content: (
            <>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-ig-pink shrink-0 mt-1" />
                    <div>
                        <h4 className="text-white font-bold">逆転ルール (The Reversal)</h4>
                        <p className="text-sm text-gray-400 mt-1">2は最弱ですが、<strong className="text-white">2 &gt; A</strong> です。</p>
                        <p className="text-xs text-gray-500 mt-1">要約：Aは最強ですが2に負けます。それ以外には2が負けます。</p>
                    </div>
                </div>
            </>
        )
      },
      mirror: {
        title: "宿命の対決",
        subtitle: "1v1 Mirror Match",
        content: (
             <div className="space-y-2">
                <p className="text-gray-300">発生条件：<strong className="text-white border-b border-white/20">同じランク</strong>の相手に遭遇した時 (例：ハートの8 vs スペードの8)。</p>
                <p className="text-gray-300">決着方法：カードでは勝負がつかないため、<strong className="text-ig-pink">ミニゲーム</strong>で決着をつけます (サイコロ、じゃんけん、睨めっこ)。</p>
                <p className="text-xs text-gray-500 bg-white/5 inline-block px-2 py-1 rounded">敗者は罰ゲーム。</p>
            </div>
        )
      },
      hierarchy: { 
          title: "チームランク", 
          subtitle: "Hierarchy",
          intro: (
              <div className="bg-white/5 border-l-4 border-ig-pink p-4 mb-6">
                  <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                      <UserMinus className="w-4 h-4 text-ig-pink" />
                      ハンティング (Team Hunting)
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                      チームはソロプレイヤーを狩ることができます。ソロは即座に敗北し、罰を受けます：
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-400 mt-2 space-y-1">
                      <li><strong className="text-white">飲む</strong>（一口または一杯）</li>
                      <li>または <strong className="text-white">Henry</strong> から「真実のカード」を引く</li>
                  </ul>
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                      #YouLieYouDrink (答えるか、倍飲むか)
                  </p>
              </div>
          )
      },
      punishment: { 
          title: "敗者への罰", 
          subtitle: "Punishment",
          content: (
            <>
                <h4 className="text-red-400 text-xs uppercase tracking-widest mb-4">敗者の選択 (Choose One)</h4>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                        <Wine className="w-5 h-5 text-white" />
                        <span className="text-gray-300">飲む (一口または一杯)。</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Skull className="w-5 h-5 text-white" />
                        <span className="text-gray-300">
                            <strong className="text-white">Henry</strong> から「真実のカード」を引く<br/>
                            <span className="text-xs text-red-400">#YouLieYouDrink (答えるか、倍飲むか)</span>
                        </span>
                    </li>
                </ul>
            </>
          )
      },
      exchange: { 
          title: "カード交換", 
          subtitle: "Exchange",
          content: (
            <div>
                <p className="text-gray-300 mb-2">手札が気に入りませんか？<br/><strong className="text-white">Lingxiao</strong> のところへ。</p>
                <div className="bg-blue-500/20 px-3 py-2 inline-block rounded text-blue-300 font-bold text-sm">
                    コスト: 1ショット = 1回交換
                </div>
                <p className="text-xs text-gray-500 mt-2">満足するまで何度でも。</p>
            </div>
          )
      },
    },
    hierarchyItems: {
        lv4: { label: "Lv.4 MAX", name: "フォー・オブ・ア・カインド", desc: "同じランクのカード4枚。最強。" },
        lv3: { label: "Lv.3 GOLD", name: "ストレートフラッシュ", desc: "3枚以上、同スートで連続 (例：♥️3, ♥️4, ♥️5)。" },
        lv2: { label: "Lv.2 SILVER", name: "スリー・オブ・ア・カインド", desc: "同じランクのカード3枚 (例：7, 7, 7)。" },
        lv1: { label: "Lv.1 BRONZE", name: "ミックス・ストレート", desc: "3枚以上、数字は連続だがスートは異なる。" }
    },
    cheatsheet: {
        title: <>CHEAT<br/>SHEET</>,
        subtitle: "クイックルール",
        items: {
            circle: { 
                title: "強さの順序", 
                content: <>
                    <p className="font-mono text-xs leading-tight font-medium break-all">
                        A&gt;K&gt;Q&gt;J&gt;10&gt;9&gt;8&gt;7&gt;6&gt;5&gt;4&gt;3<span className="text-ig-pink font-bold">&gt;2</span>
                    </p>
                    <p className="text-xs font-bold mt-1 bg-black text-white inline-block px-1">
                        注意: 2 &gt; A (循環)
                    </p>
                </>
            },
            mirror: {
                title: "宿命の対決",
                content: <p className="text-xs font-medium leading-relaxed">
                    同じランク (例：♥️8 vs ♠️8) = <span className="underline decoration-2">ミニゲーム</span> (サイコロ/じゃんけん)。
                </p>
            },
            hierarchy: {
                title: "役の強さ",
                content: <ol className="text-xs font-bold space-y-1 list-decimal list-inside">
                    <li>フォーカード (4 Kind)</li>
                    <li>ストレートフラッシュ</li>
                    <li>スリーカード (3 Kind)</li>
                    <li>ミックス・ストレート</li>
                    <li className="font-normal text-red-600">ソロ (チームに敗北)</li>
                </ol>
            },
            punishment: {
                title: "罰と交換",
                content: <ul className="text-xs space-y-2">
                    <li className="flex gap-2">
                        <span className="font-bold">💀 負け:</span>
                        <span className="leading-tight">飲む OR 真実(Henry)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">🔄 交換:</span>
                        <span className="leading-tight">Lingxiaoへ, <br/>1ショット = 無限交換</span>
                    </li>
                </ul>
            }
        },
        footer: <>DON'T HATE THE PLAYER,<br/>HATE THE GAME.</>
    }
  },
  fr: {
    mainTitle: "Poker Battle Royale",
    manualSubtitle: "Manuel Officiel v1.0",
    sections: {
      setup: {
        title: "Configuration",
        subtitle: "Setup",
        items: [
          { label: "Total", value: "52 Cartes", note: "(Pas de Jokers)" },
          { label: "Deck Public", value: "12 Cartes", note: "(Gardien: Lingxiao)" },
          { label: "Joueurs", value: "40 Max", note: "(Solo ou Équipe)" },
        ]
      },
      circle: {
        title: "Cercle de la Mort",
        subtitle: "Règles",
        content: (
            <>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-ig-pink shrink-0 mt-1" />
                    <div>
                        <h4 className="text-white font-bold">L'Inversion (The Reversal)</h4>
                        <p className="text-sm text-gray-400 mt-1">2 est le plus petit, mais <strong className="text-white">2 &gt; A</strong>.</p>
                        <p className="text-xs text-gray-500 mt-1">Résumé : A est le chef, seul le 2 bat l'A ; les autres battent le 2.</p>
                    </div>
                </div>
            </>
        )
      },
      mirror: {
        title: "Duel Miroir 1v1",
        subtitle: "Duel",
        content: (
             <div className="space-y-2">
                <p className="text-gray-300">Condition : Quand vous rencontrez un adversaire avec le <strong className="text-white border-b border-white/20">Même Rang</strong> (ex. 8 de Cœur vs 8 de Pique).</p>
                <p className="text-gray-300">Duel : Les cartes étant égales, vous devez vous départager via un <strong className="text-ig-pink">Mini-Jeu</strong> (Dés, Pierre-Feuille-Ciseaux).</p>
                <p className="text-xs text-gray-500 bg-white/5 inline-block px-2 py-1 rounded">Le perdant accepte la punition.</p>
            </div>
        )
      },
      hierarchy: { 
          title: "Hiérarchie", 
          subtitle: "Ranks",
          intro: (
              <div className="bg-white/5 border-l-4 border-ig-pink p-4 mb-6">
                  <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                      <UserMinus className="w-4 h-4 text-ig-pink" />
                      Règle de Chasse (Équipe vs Solo)
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                      Les équipes peuvent chasser les joueurs solo. Le solo perd automatiquement et doit accepter la punition :
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-400 mt-2 space-y-1">
                      <li><strong className="text-white">Boire</strong> (Gorgée ou Shot)</li>
                      <li>OU Voir Henry pour une <strong className="text-white">"Carte Vérité"</strong></li>
                  </ul>
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                      #YouLieYouDrink (Répondre ou boire double)
                  </p>
              </div>
          )
      },
      punishment: { 
          title: "Punition", 
          subtitle: "Pour les Perdants",
          content: (
            <>
                <h4 className="text-red-400 text-xs uppercase tracking-widest mb-4">Choix du Perdant (Un seul)</h4>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                        <Wine className="w-5 h-5 text-white" />
                        <span className="text-gray-300">Boire (Une gorgée ou un shot).</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Skull className="w-5 h-5 text-white" />
                        <span className="text-gray-300">
                            Voir <strong className="text-white">Henry</strong> pour une "Carte Vérité"<br/>
                            <span className="text-xs text-red-400">#YouLieYouDrink (Répondre ou boire double)</span>
                        </span>
                    </li>
                </ul>
            </>
          )
      },
      exchange: { 
          title: "Échange", 
          subtitle: "Swap",
          content: (
            <div>
                <p className="text-gray-300 mb-2">Pas satisfait de votre main ?<br/>Voir <strong className="text-white">Lingxiao</strong>.</p>
                <div className="bg-blue-500/20 px-3 py-2 inline-block rounded text-blue-300 font-bold text-sm">
                    Coût : 1 Shot = 1 Échange
                </div>
                <p className="text-xs text-gray-500 mt-2">Essais illimités.</p>
            </div>
          )
      },
    },
    hierarchyItems: {
        lv4: { label: "Lv.4 MAX", name: "Carré", desc: "4 cartes de même rang. Ignore la couleur, écrase tout." },
        lv3: { label: "Lv.3 OR", name: "Quinte Flush", desc: "3+ cards, même couleur, suite (ex. ♥️3, ♥️4, ♥️5)." },
        lv2: { label: "Lv.2 ARGENT", name: "Brelan", desc: "3 cartes de même rang (ex. 7, 7, 7)." },
        lv1: { label: "Lv.1 BRONZE", name: "Suite Mixte", desc: "3+ cartes, suite mais couleurs mixtes." }
    },
    cheatsheet: {
        title: <>TRICHE<br/>SHEET</>,
        subtitle: "Règles Rapides",
        items: {
            circle: { 
                title: "Cercle de la Mort", 
                content: <>
                    <p className="font-mono text-xs leading-tight font-medium break-all">
                        A&gt;K&gt;Q&gt;J&gt;10&gt;9&gt;8&gt;7&gt;6&gt;5&gt;4&gt;3<span className="text-ig-pink font-bold">&gt;2</span>
                    </p>
                    <p className="text-xs font-bold mt-1 bg-black text-white inline-block px-1">
                        Note : 2 &gt; A (Cycle complet)
                    </p>
                </>
            },
            mirror: {
                title: "Duel Miroir",
                content: <p className="text-xs font-medium leading-relaxed">
                    Même Rang (ex. ♥️8 vs ♠️8) = <span className="underline decoration-2">Mini-Jeu</span> (Dés/PFC).
                </p>
            },
            hierarchy: {
                title: "Hiérarchie",
                content: <ol className="text-xs font-bold space-y-1 list-decimal list-inside">
                    <li>Carré (4 Kind)</li>
                    <li>Quinte Flush</li>
                    <li>Brelan (3 Kind)</li>
                    <li>Suite Mixte</li>
                    <li className="font-normal text-red-600">Solo (Perd vs Équipe!)</li>
                </ol>
            },
            punishment: {
                title: "Perdre & Échanger",
                content: <ul className="text-xs space-y-2">
                    <li className="flex gap-2">
                        <span className="font-bold">💀 Perdre:</span>
                        <span className="leading-tight">Boire OU Vérité (Henry)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">🔄 Échanger:</span>
                        <span className="leading-tight">Voir Lingxiao, <br/>1 Shot = Échange Illimité</span>
                    </li>
                </ul>
            }
        },
        footer: <>DON'T HATE THE PLAYER,<br/>HATE THE GAME.</>
    }
  }
};

export const GameRulesModal: React.FC<GameRulesModalProps> = ({ onClose, lang }) => {
  const content = CONTENT[lang];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
    >
        <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors z-50"
        >
            <X className="w-10 h-10" />
        </button>

        <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-7xl h-[85vh] bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-lg"
        >
            
            {/* --- LEFT: Detailed Manual (Scrollable) --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 border-r border-white/5 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ig-pink to-purple-600 opacity-50" />
                
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-2 text-white">
                    {content.mainTitle}
                </h2>
                <p className="text-sm font-mono text-ig-pink tracking-[0.3em] uppercase mb-12">
                    {content.manualSubtitle}
                </p>

                <div className="space-y-12">
                    {/* Section 1: Setup */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xl font-bold text-gray-600 font-mono">01.</span>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{content.sections.setup.title} <span className="text-gray-500 text-sm font-normal">{content.sections.setup.subtitle}</span></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {content.sections.setup.items?.map((item, idx) => (
                                <div key={idx} className="bg-white/5 p-4 rounded-sm border-l-2 border-white/20">
                                    <h4 className="text-xs text-gray-400 uppercase tracking-widest mb-1">{item.label}</h4>
                                    <p className="text-lg font-medium">{item.value} <span className="text-xs text-gray-500">{item.note}</span></p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 2: Circle */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xl font-bold text-gray-600 font-mono">02.</span>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{content.sections.circle.title} <span className="text-gray-500 text-sm font-normal">{content.sections.circle.subtitle}</span></h3>
                        </div>
                        <div className="bg-gradient-to-r from-white/5 to-transparent p-6 rounded-sm border border-white/5">
                            {/* Expanded Sequence */}
                            <div className="flex flex-wrap items-center gap-2 text-lg md:text-xl font-light text-gray-300 font-mono">
                                <span className="font-bold text-white">A</span> &gt; 
                                <span>K</span> &gt; 
                                <span>Q</span> &gt; 
                                <span>J</span> &gt; 
                                <span>10</span> &gt; 
                                <span>9</span> &gt; 
                                <span>8</span> &gt; 
                                <span>7</span> &gt; 
                                <span>6</span> &gt; 
                                <span>5</span> &gt; 
                                <span>4</span> &gt; 
                                <span>3</span> &gt; 
                                <span className="text-ig-pink font-bold">2</span> &gt; 
                                <span className="font-bold text-white">A</span>
                            </div>
                            {content.sections.circle.content}
                        </div>
                    </section>

                    {/* Section 3: Mirror */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xl font-bold text-gray-600 font-mono">03.</span>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{content.sections.mirror.title} <span className="text-gray-500 text-sm font-normal">{content.sections.mirror.subtitle}</span></h3>
                        </div>
                        <div className="flex gap-4 items-start">
                            <Swords className="w-8 h-8 text-white/20" />
                            {content.sections.mirror.content}
                        </div>
                    </section>

                    {/* Section 4: Hierarchy */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xl font-bold text-gray-600 font-mono">04.</span>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{content.sections.hierarchy.title} <span className="text-gray-500 text-sm font-normal">{content.sections.hierarchy.subtitle}</span></h3>
                        </div>
                        
                        {/* New Team Hunting Intro Rule */}
                        {content.sections.hierarchy.intro}

                        <div className="space-y-3">
                            {/* Lv 4 */}
                            <div className="group relative bg-[#111] border border-white/10 p-4 hover:border-ig-pink transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-ig-pink uppercase tracking-widest border border-ig-pink/30 px-2 py-0.5 rounded-full">{content.hierarchyItems.lv4.label}</span>
                                    <span className="text-white font-bold text-lg">{content.hierarchyItems.lv4.name}</span>
                                </div>
                                <p className="text-sm text-gray-400">{content.hierarchyItems.lv4.desc}</p>
                            </div>

                            {/* Lv 3 */}
                            <div className="group relative bg-[#111] border border-white/10 p-4 hover:border-ig-pink/50 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest border border-yellow-500/30 px-2 py-0.5 rounded-full">{content.hierarchyItems.lv3.label}</span>
                                    <span className="text-white font-bold text-lg">{content.hierarchyItems.lv3.name}</span>
                                </div>
                                <p className="text-sm text-gray-400">{content.hierarchyItems.lv3.desc}</p>
                            </div>

                             {/* Lv 2 */}
                             <div className="group relative bg-[#111] border border-white/10 p-4 hover:border-gray-500 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border border-gray-400/30 px-2 py-0.5 rounded-full">{content.hierarchyItems.lv2.label}</span>
                                    <span className="text-white font-bold text-lg">{content.hierarchyItems.lv2.name}</span>
                                </div>
                                <p className="text-sm text-gray-400">{content.hierarchyItems.lv2.desc}</p>
                            </div>

                            {/* Lv 1 */}
                            <div className="group relative bg-[#111] border border-white/10 p-4 hover:border-gray-700 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest border border-gray-600/30 px-2 py-0.5 rounded-full">{content.hierarchyItems.lv1.label}</span>
                                    <span className="text-white font-bold text-lg">{content.hierarchyItems.lv1.name}</span>
                                </div>
                                <p className="text-sm text-gray-400">{content.hierarchyItems.lv1.desc}</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 & 6 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-xl font-bold text-gray-600 font-mono">05.</span>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{content.sections.punishment.title} <span className="text-gray-500 text-sm font-normal">{content.sections.punishment.subtitle}</span></h3>
                            </div>
                            <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-sm h-full">
                                {content.sections.punishment.content}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-xl font-bold text-gray-600 font-mono">06.</span>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{content.sections.exchange.title} <span className="text-gray-500 text-sm font-normal">{content.sections.exchange.subtitle}</span></h3>
                            </div>
                            <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-sm h-full">
                                {content.sections.exchange.content}
                            </div>
                        </section>
                    </div>

                    <div className="h-12" /> {/* Bottom spacer */}
                </div>
            </div>

            {/* --- RIGHT: Cheatsheet (Sticky/Fixed Visual) --- */}
            <div className="w-full md:w-[350px] bg-[#E5E5E5] text-black p-8 md:p-10 flex flex-col shrink-0 relative">
                {/* Paper texture effect overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-30 pointer-events-none" />
                
                <div className="relative z-10 h-full flex flex-col">
                    <div className="mb-8 pb-4 border-b-2 border-black">
                        <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
                            {content.cheatsheet.title}
                        </h2>
                        <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">{content.cheatsheet.subtitle}</p>
                    </div>

                    <div className="flex-1 space-y-8">
                        {/* Cheatsheet Item 1 */}
                        <div>
                            <h4 className="font-black uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-black rounded-full"></span>
                                {content.cheatsheet.items.circle.title}
                            </h4>
                            {content.cheatsheet.items.circle.content}
                        </div>

                        {/* Cheatsheet Item 2 */}
                        <div>
                            <h4 className="font-black uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-black rounded-full"></span>
                                {content.cheatsheet.items.mirror.title}
                            </h4>
                            {content.cheatsheet.items.mirror.content}
                        </div>

                        {/* Cheatsheet Item 3 */}
                        <div>
                            <h4 className="font-black uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-black rounded-full"></span>
                                {content.cheatsheet.items.hierarchy.title}
                            </h4>
                            {content.cheatsheet.items.hierarchy.content}
                        </div>

                         {/* Cheatsheet Item 4 */}
                         <div>
                            <h4 className="font-black uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-black rounded-full"></span>
                                {content.cheatsheet.items.punishment.title}
                            </h4>
                            {content.cheatsheet.items.punishment.content}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t-2 border-black text-[10px] font-mono opacity-60 text-center">
                        {content.cheatsheet.footer}
                    </div>
                </div>
            </div>

        </motion.div>
    </motion.div>
  );
};
