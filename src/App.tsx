import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  CloudSun, 
  RefreshCw, 
  ChevronRight,
  Calendar,
  Plus,
  Trash2,
  Wallet,
  Plane,
  Flower2,
  ArrowRight,
  ShoppingBag,
  Map as MapIcon,
  CheckCircle2,
  Circle
} from "lucide-react";

// --- Types ---
interface Attraction {
  time: string;
  name: string;
  duration: string;
  description: string;
  type?: 'flight' | 'standard' | 'hotel' | 'dinner' | 'transport';
  image?: string;
  subItems?: { name: string; time: string; note: string }[];
}

interface DayPlan {
  date: string;
  day: string;
  weather: {
    temp: string;
    condition: string;
    icon: string;
  };
  attractions: Attraction[];
}

interface Expense {
  id: string;
  item: string;
  category: string;
  amount: number;
  currency: 'JPY' | 'TWD';
  date: string;
  paymentMethod: 'cash' | 'credit';
}

interface ShoppingItem {
  id: string;
  name: string;
  price?: string;
  isBought: boolean;
}

// --- Data ---
const ITINERARY_DATA: DayPlan[] = [
  {
    date: "4/17",
    day: "Day 1: 福岡天神首航",
    weather: { temp: "18°C / 12°C", condition: "晴時多雲", icon: "☀️" },
    attractions: [
      {
        time: "14:40",
        name: "桃園TPE ➡️ 福岡FUK (CI128)",
        duration: "2h 25m",
        description: "搭乘中華航空 CI128 班機，從桃園機場 T2 出發。18:05 抵達福岡。",
        type: 'flight'
      },
      {
        time: "18:05",
        name: "抵達福岡機場",
        duration: "1 小時",
        description: "跟著「Shuttle Bus」指標走 ➡️ 5號巴士站候車 ➡️ 搭乘接駁巴士前往地鐵站 ➡️ 轉乘機場線至天神站。",
        image: "https://d1grca2t3zpuug.cloudfront.net/2025/10/fukuokaairport_cover-870x500-1759925994.webp"
      },
      {
        time: "19:30",
        name: "飯店 Check-in",
        duration: "30 min",
        description: "入住 QUINTESSA 福岡天神 Comic & Books。地址：3 Chome-2-10 Tenjin, Chuo Ward, Fukuoka。",
        type: 'hotel',
        image: "https://q-xx.bstatic.com/xdata/images/hotel/max500/284226582.jpg?k=53722a659e2b23ea3a9dc5e16bacb538d655839122790a0df93484178003d07d&o="
      },
      {
        time: "20:30",
        name: "天神晚餐時光",
        duration: "2 小時",
        description: "天神地區人氣美食推薦清單。",
        type: 'dinner',
        image: "https://resources.matcha-jp.com/resize/720x2000/2024/04/23-177958.webp",
        subItems: [
          {
            name: "元祖博多めんたい重 西中洲",
            time: "07:00 ~ 22:30",
            note: "整條明太子霸氣躺在白飯上，沾麵麵條極Q，醬汁濃郁。"
          },
          {
            name: "麵屋兼虎 天神本店",
            time: "10:00 ~ 22:00",
            note: "濃厚派沾麵，湯底由豬骨、雞骨與海鮮熬煮，帶有柚子皮清香。"
          },
          {
            name: "博多拉麵 ShinShin 天神本店",
            time: "11:00 ~ 03:00",
            note: "No.1 溏心蛋拉麵，濃厚豚骨與雞骨清香，推薦加蒜泥更美味。"
          },
          {
            name: "Torikizoku 鳥貴族",
            time: "17:00 ~ 01:00",
            note: "人氣連鎖烤雞肉串，使用日本國產食材，搭配自製醬汁。"
          }
        ]
      }
    ]
  },
  {
    date: "4/18",
    day: "Day 2: 博多巡禮與購物",
    weather: { temp: "20°C / 14°C", condition: "晴朗", icon: "☀️" },
    attractions: [
      {
        time: "10:30",
        name: "食堂 おわん (早餐)",
        duration: "1.5 小時",
        description: "以高湯玉子燒為主，使用福岡鞍手町產的「卵の王樣」貴黃卵，搭配六十年歷史的中洲明太子。",
        image: "https://arne.media/uploads/2025/06/DSC01801-2.jpg"
      },
      {
        time: "12:00",
        name: "櫛田神社",
        duration: "1 小時",
        description: "博多最古老的神社之一。必摸「撫牛」祈求智慧與健康，相傳摸牛頭長智慧、摸牛身保平安。",
        image: "https://resources.matcha-jp.com/resize/720x2000/2024/04/19-177478.webp"
      },
      {
        time: "14:00",
        name: "博多運河城",
        duration: "3 小時",
        description: "ALPEN 福岡、拉麵競技場，盡情逛街購物。",
        image: "https://assets.funliday.com/posts/wp-content/uploads/2024/12/02162019/Snapinsta.app_415939155_879937227472084_2068015520542221285_n_1080-1.jpg"
      },
      {
        time: "17:30",
        name: "博多午茶點心時間",
        duration: "1.5 小時",
        description: "品嚐博多在地超人氣麵包與甜點。",
        type: 'dinner',
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRufFzDgHq6icxXlK2SSZNrwNrpIAtoBanlCg&s",
        subItems: [
          {
            name: "Dacomecca",
            time: "07:00 - 19:00",
            note: "香腸薄脆噴汁，搭配酸爽紫高麗菜，口味平衡且麵包極具嚼勁。"
          },
          {
            name: "Imonne Hakata",
            time: "10:00 - 21:00",
            note: "以「新ジェラ餅」聞名，現場用柔軟麻糬包裹冰涼冰淇淋，口感驚艷。"
          }
        ]
      },
      {
        time: "19:45",
        name: "西新初喜 (壽喜燒)",
        duration: "2 小時",
        description: "福岡老字號精肉店直營，提供頂級黑毛和牛與特選伊萬里牛，享受入口即化的霜降美味。",
        image: "https://image.kkday.com/v2/image/get/s1.kkday.com/product_179016/20240522144823_G60AM/jpg"
      }
    ]
  },
  {
    date: "4/19",
    day: "Day 3: 太宰府文化之旅",
    weather: { temp: "16°C / 8°C", condition: "多雲", icon: "☁️" },
    attractions: [
      {
        time: "09:30",
        name: "西鐵太宰府觀光列車「旅人」",
        duration: "1 小時",
        description: "從天神前往太宰府的交通方式。推薦使用「太宰府一日券」。",
        type: 'dinner',
        image: "https://missrosetraveljournal.wordpress.com/wp-content/uploads/2020/07/logo-1-1.jpg",
        subItems: [
          {
            name: "交通路線指南 (一日券適用)",
            time: "天神 ➡️ 太宰府",
            note: "飯店 ➡️ 西鐵福岡(天神)站 ➡️ 西鐵二日市 ➡️ 太宰府站 ➡️ 換乘巴士 ➡️ 內山站下車。"
          },
          {
            name: "「旅人 TABITO」觀光列車",
            time: "特色介紹",
            note: "外部彩繪四季花卉，內部由5種開運紋樣構成。3號車可寫下心願，前往竈門神社結良緣。"
          }
        ]
      },
      {
        time: "10:30",
        name: "寶滿宮竈門神社",
        duration: "1.5 小時",
        description: "主祭神為結緣之神「玉依姬命」，除了愛情姻緣，也司掌家庭、工作與人際關係。此外也以除厄、消災出名，並能保佑女性內外在美。",
        image: "https://hanejapan.com/wp-content/uploads/2025/08/28083419_m-1024x681.jpg"
      },
      {
        time: "12:00",
        name: "太宰府天滿宮",
        duration: "3 小時",
        description: "奉祀學問之神菅原道真。必看御神牛、太鼓橋，以及象徵長壽與智慧的麒麟像。目前本殿整修中，可參拜充滿現代感的臨時本殿。",
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiO9lUQwWJUmSU_X2ZLk8nlNTTjANq5Wvhtw_rA5PD44liTb7_Gt3QauCuEap96OMURIfv_hhD5UimLrl4vFWx7X3jKXE3PLPlsuLx1qYL6mMTKx-KSBMON0Kup6c3rt2bu4dGpGnFmuuCqbM0wanJSxKlDC-QCsVu7eeK0PHNTr6p82kcvDDrUv601efUW/s1600-rw/%E5%A4%AA%E5%AE%B0%E5%BA%9C%E5%A4%A9%E6%BB%BF%E5%AE%AE.jpg"
      },
      {
        time: "15:30",
        name: "太宰府參道點心時間",
        duration: "2 小時",
        description: "漫步太宰府參道，品嚐在地特色名產與人氣甜點。",
        type: 'dinner',
        image: "https://article-image.travel.navitime.jp/img/NTJmat0614-zh-tw/NTJmat0614.03.jpg",
        subItems: [
          {
            name: "一蘭拉麵 太宰府店",
            time: "全球唯一五角碗",
            note: "合格拉麵配2片叉燒、黑木耳、海鮮、半熟蛋。59公分麵條象徵長度，特製五角碗獨一無二。"
          },
          {
            name: "梅枝餅 かさの家 / 安武",
            time: "百年老舖職人現烤",
            note: "創業於1922年，外皮微焦酥香印有梅花紋，內餡紅豆飽滿細甜，熱騰騰好燙口。"
          },
          {
            name: "天山 草莓最中・大福",
            time: "垂涎欲滴太誘人",
            note: "頂級草莓酸甜氣味鮮明多汁，搭配QQ麻糬皮與甜而不膩紅豆泥，口感驚艷。"
          },
          {
            name: "味の明太子ふくや",
            time: "日本第一家明太子品牌",
            note: "鮮甜柴魚高湯佐上大塊辣味十足明太子，中間點綴嗆辣芥末，天冷時吃上一碗好滿足。"
          },
          {
            name: "福太郎 明太子烤飯糰",
            time: "福屋販售人氣點心",
            note: "米飯烤到酥香帶有迷人鍋巴焦香，配上份量足夠的濃厚明太子，佐上海苔和紫蘇美味極了。"
          },
          {
            name: "太宰府梅子汽水",
            time: "清爽梅子香",
            note: "太宰府天滿宮以梅花聞名，當地學生採收加工成梅子糖漿再製成汽水，炎炎夏日超解渴。"
          },
          {
            name: "YAMAYA BASE",
            time: "明太子法國麵包",
            note: "現點現烤麵包外酥內軟，滿邊明太子抹醬毫不手軟，令人驚艷。"
          },
          {
            name: "太宰府星巴克",
            time: "隈研吾大師設計",
            note: "由2,000根檜木條編織成建築框架，溫暖木質空間與咖啡香完美融合。"
          }
        ]
      },
      {
        time: "18:30",
        name: "天神晚餐巡禮",
        duration: "2 小時",
        description: "元祖博多明太重、水炊料裡 Toriden、博多華味鳥。",
        image: "https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/02/a0002729/img/basic/a0002729_main.jpg"
      }
    ]
  },
  {
    date: "4/20",
    day: "Day 4: 相島貓島與燒肉",
    weather: { temp: "17°C / 11°C", condition: "晴時多雲", icon: "⛅" },
    attractions: [
      {
        time: "10:00",
        name: "天神 ➡️ 相島 (去程)",
        duration: "1h 47m",
        description: "西鐵天神站 ➡️ 貝塚 ➡️ 西鐵新宮 ➡️ 轉乘社區巴士「Marinx」(第2路線逆回り) ➡️ 新宮港搭船。",
        type: 'transport',
        image: "https://image.kkday.com/v2/image/get/c_fill%2Cq_55%2Ct_webp%2Cw_960/s1.kkday.com/product_135793/20221115025903_IPoj0/jpg",
        subItems: [
          {
            name: "去程時刻表 (關鍵接駁)",
            time: "11:05 - 11:47",
            note: "11:05 新宮巴士站發車 ➡️ 11:17 抵達新宮港 ➡️ 11:30 渡輪開船 ➡️ 11:47 抵達相島。"
          }
        ]
      },
      {
        time: "11:30",
        name: "相島 (貓島) 探索",
        duration: "4 小時",
        description: "位於福岡縣新宮町北方約8公里海面上的相島。島上生活著約180隻貓咪，被美國CNN選為世界六大貓景點之一。島上保留著豐富的歷史遺跡、古墳群與海蝕奇岩。必看：若宮神社（祭祀豐玉姬命與玉依姬命，保佑安產與良緣）。記得帶著貓乾糧去！",
        image: "https://www.japaholic.com/storage/files/article_images/MTEyMDI0MDUwNzE4MTkxMjgx.jpg"
      },
      {
        time: "13:50",
        name: "相島 ➡️ 博多 (回程)",
        duration: "50m",
        description: "相島搭船 ➡️ 抵達新宮港 ➡️ 搭巴士往福工大前站 ➡️ 抵達JR福工大前 ➡️ 博多站。",
        type: 'transport',
        subItems: [
          {
            name: "回程時刻表",
            time: "13:50 - 14:40",
            note: "13:50 渡輪開船 ➡️ 14:07 抵達新宮港 ➡️ 14:29 巴士發車 ➡️ 14:40 抵達JR福工大前站。"
          }
        ]
      },
      {
        time: "19:00",
        name: "藥院燒肉 NIKUICHI",
        duration: "2 小時",
        description: "品嚐九州產黑毛和牛，福岡人氣燒肉店。平均每人約 800 台幣。",
        image: "https://d1grca2t3zpuug.cloudfront.net/2025/09/yakiniku_jyou2025_MAIN-870x500-1756977231.webp"
      }
    ]
  },
  {
    date: "4/21",
    day: "Day 5: 大濠公園與歸途",
    weather: { temp: "19°C / 13°C", condition: "晴朗", icon: "☀️" },
    attractions: [
      {
        time: "10:00",
        name: "ROBATA NO ITO OKASHI",
        duration: "1.5 小時",
        description: "銀鮭一夜干十分厚實，以炭火烤製外皮香脆，醃製不會過鹹且肉質軟嫩，但我偏好油脂較豐厚的鮭魚，所以更喜歡另外兩小塊鮭魚腹，嚐起來油花細美。",
        image: "https://image.kkday.com/v2/image/get/c_fill%2Cq_55%2Ct_webp%2Cw_960/s1.kkday.com/product_274101/20250320014044_d12r1/png"
      },
      {
        time: "12:00",
        name: "大濠公園 / &LOCALS",
        duration: "3 小時",
        description: "悠閒散步，享受最後的福岡時光。&LOCALS 大濠公園店。",
        image: "https://static.gltjp.com/glt/data/directory/14000/13298/20220724_182904_2ee5f53b_w640.webp"
      },
      {
        time: "15:00",
        name: "天神地下街",
        duration: "2 小時",
        description: "最後的逛逛買買，外帶明太子麵包，準備前往機場。",
        image: "https://media.fukuokainsider.com/wp-content/uploads/2024/11/05161023/f3.jpg"
      },
      {
        time: "21:00",
        name: "福岡FUK ➡️ 桃園TPE (CI117)",
        duration: "2h 30m",
        description: "搭乘中華航空 CI117 班機，帶著滿滿回憶回家！22:30 抵達台北。",
        type: 'flight'
      }
    ]
  }
];

// --- Components ---

const FlightTicket = ({ item }: { item: Attraction }) => {
  const [from, to] = item.name.split(' ➡️ ');
  const flightNo = item.name.match(/\((.*?)\)/)?.[1] || 'CI117';
  
  // Try to extract arrival time from description (e.g., "22:30 抵達")
  const arrivalTimeMatch = item.description.match(/(\d{2}:\d{2})\s*抵達/);
  const arrivalTime = arrivalTimeMatch ? arrivalTimeMatch[1] : '--:--';
  
  const destCity = to.includes('福岡') ? 'Fukuoka' : (to.includes('桃園') ? 'Taipei' : 'Destination');

  return (
    <div className="relative w-full bg-[#88B0E6] rounded-2xl shadow-lg overflow-hidden text-white p-5 mb-4 flex items-center justify-between border border-white/20">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
      <div className="flex-1 z-10">
        <div className="text-xs font-black opacity-70 mb-1 tracking-widest">{flightNo}</div>
        <div className="text-xl font-black tracking-tighter">{from.split('(')[0].trim()}</div>
        <div className="text-xs font-bold opacity-70">{item.time}</div>
      </div>

      <div className="flex flex-col items-center px-6 z-10">
        <div className="text-xs font-black opacity-50 mb-1">{item.duration}</div>
        <div className="flex items-center gap-2 w-20">
          <div className="h-[1px] flex-1 bg-white/30" />
          <Plane className="w-4 h-4 rotate-90 opacity-60" />
          <div className="h-[1px] flex-1 bg-white/30" />
        </div>
      </div>

      <div className="flex-1 text-right z-10">
        <div className="text-xs font-black opacity-70 mb-1 tracking-widest">ARRIVAL</div>
        <div className="text-xl font-black tracking-tighter">{to.split('(')[0].trim()}</div>
        <div className="text-xs font-bold opacity-70 uppercase">{arrivalTime} {destCity}</div>
      </div>
    </div>
  );
};

const TransportTicket = ({ item }: { item: Attraction }) => {
  const [from, to] = item.name.split(' ➡️ ');
  const isReturn = item.name.includes('回程');

  return (
    <div className={`relative w-full ${isReturn ? 'bg-[#F9A8D4]' : 'bg-[#93C5FD]'} rounded-2xl shadow-md overflow-hidden text-white p-4 mb-4 border border-white/20`}>
      <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mt-8" />
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex-1">
          <div className="text-xs font-black opacity-70 mb-0.5 tracking-widest uppercase">{isReturn ? 'Inbound' : 'Outbound'}</div>
          <div className="text-lg font-black tracking-tighter leading-none mb-1">{from.trim()}</div>
          <div className="text-xs font-bold opacity-70">{item.time}</div>
        </div>

        <div className="flex flex-col items-center px-4">
          <div className="text-xs font-black opacity-50 mb-0.5">{item.duration}</div>
          <div className="flex items-center gap-1.5 w-16">
            <div className="h-[1px] flex-1 bg-white/30" />
            <Navigation className={`w-3 h-3 opacity-60 ${isReturn ? 'rotate-180' : ''}`} />
            <div className="h-[1px] flex-1 bg-white/30" />
          </div>
        </div>

        <div className="flex-1 text-right">
          <div className="text-xs font-black opacity-70 mb-0.5 tracking-widest uppercase">Destination</div>
          <div className="text-lg font-black tracking-tighter leading-none mb-1">{to.split('(')[0].trim()}</div>
          <div className="text-xs font-bold opacity-70 uppercase">Transport</div>
        </div>
      </div>

      {item.subItems && item.subItems.length > 0 && (
        <div className="relative z-10 bg-black/10 backdrop-blur-sm rounded-xl p-2.5 mt-1 border border-white/10">
          <div className="text-xs font-black opacity-50 mb-1 uppercase tracking-wider">Detailed Schedule</div>
          {item.subItems.map((sub, idx) => (
            <div key={idx} className="text-xs font-bold leading-relaxed opacity-95">
              {sub.note}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AttractionCard = ({ item }: { item: Attraction }) => {
  if (item.type === 'flight') return <FlightTicket item={item} />;
  if (item.type === 'transport') return <TransportTicket item={item} />;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-[24px] shadow-sm overflow-hidden flex active:scale-[0.98] transition-all border border-[#ffdda5]/30 hover:shadow-md"
    >
      <div className="w-28 sm:w-36 h-32 sm:h-auto flex-shrink-0 relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-black text-slate-700 shadow-sm">
          {item.time}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-br from-white to-[#FFFAF0]/50">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-sm font-black text-slate-800 line-clamp-1 tracking-tight">{item.name}</h3>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <div className="bg-[#bbdfff]/20 p-1 rounded-md">
              <Clock className="w-3 h-3 text-[#5A86C2]" />
            </div>
            <span className="text-xs font-bold text-slate-400">{item.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#ffdda5]/20 rounded-full flex items-center justify-center">
              <Navigation className="w-3 h-3 text-[#D97706]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BudgetPage = ({ 
  isAdding, 
  setIsAdding, 
  expenses, 
  setExpenses 
}: { 
  isAdding: boolean, 
  setIsAdding: (v: boolean) => void,
  expenses: Expense[],
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
}) => {
  const [newItem, setNewItem] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCurrency, setNewCurrency] = useState<'JPY' | 'TWD'>('JPY');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [filter, setFilter] = useState<'all' | 'cash' | 'credit'>('all');
  const [displayCurrency, setDisplayCurrency] = useState<'TWD' | 'JPY'>('TWD');
  const rate = 0.21;

  useEffect(() => {
    if (isAdding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAdding]);

  const addExpense = () => {
    if (!newItem || !newAmount) return;
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const amountVal = parseFloat(newAmount);
    const jpyAmount = newCurrency === 'TWD' ? amountVal / rate : amountVal;

    const newExpense: Expense = {
      id: Date.now().toString(),
      item: newItem,
      category: "一般",
      amount: jpyAmount,
      currency: 'JPY',
      date: dateStr,
      paymentMethod: paymentMethod
    };
    setExpenses([newExpense, ...expenses]);
    setNewItem("");
    setNewAmount("");
    setNewCurrency('JPY');
    setIsAdding(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalJPY = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const cashJPY = expenses.filter(e => e.paymentMethod === 'cash').reduce((acc, curr) => acc + curr.amount, 0);
  const creditJPY = expenses.filter(e => e.paymentMethod === 'credit').reduce((acc, curr) => acc + curr.amount, 0);

  const filteredExpenses = expenses.filter(e => filter === 'all' || e.paymentMethod === filter);

  const formatAmount = (jpy: number) => {
    if (displayCurrency === 'TWD') {
      return `$ ${(jpy * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
    return `¥ ${jpy.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex items-center justify-between">
        <div className="bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/30">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">旅費管理</h2>
        </div>
        <div className="bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 flex items-center gap-2">
          <RefreshCw className="w-3 h-3 text-[#4A69BD]" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">1 JPY = {rate} TWD</span>
        </div>
      </div>

      {/* Main Total Card */}
      <div className="relative overflow-hidden bg-white/60 backdrop-blur-md p-8 rounded-[40px] shadow-sm text-slate-800 border border-white/40">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#bbdfff]/20 rounded-full -mr-24 -mt-24 blur-3xl" />
        
        <div className="relative z-10 space-y-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center">
              <button 
                onClick={() => setDisplayCurrency(displayCurrency === 'TWD' ? 'JPY' : 'TWD')}
                className="bg-[#bbdfff]/30 px-3 py-1 rounded-full text-[10px] font-black text-[#5A86C2] uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#bbdfff]/50 transition-all"
              >
                <RefreshCw className="w-3 h-3" /> 切換幣別 ({displayCurrency})
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">總支出 ({displayCurrency})</p>
            <div className="text-5xl font-black tracking-tighter text-[#5A86C2]">
              {formatAmount(totalJPY)}
            </div>
            <p className="text-[10px] font-bold text-slate-300 italic">
              {displayCurrency === 'TWD' ? `日幣總計 ¥${totalJPY.toLocaleString()}` : `台幣總計 $${(totalJPY * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            </p>
          </div>

          <div className="h-[1px] bg-slate-100 w-full" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" /> 現金
              </div>
              <div className="text-xl font-black text-slate-700">{formatAmount(cashJPY)}</div>
              <div className="text-[10px] font-bold text-slate-300">
                {displayCurrency === 'TWD' ? `¥${cashJPY.toLocaleString()}` : `$${(cashJPY * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </div>
            </div>
            <div className="h-12 w-[1px] bg-slate-100" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                <div className="w-1.5 h-1.5 bg-[#bbdfff] rounded-full" /> 信用卡
              </div>
              <div className="text-xl font-black text-slate-700">{formatAmount(creditJPY)}</div>
              <div className="text-[10px] font-bold text-slate-300">
                {displayCurrency === 'TWD' ? `¥${creditJPY.toLocaleString()}` : `$${(creditJPY * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/30">
          <h3 className="text-sm font-black text-slate-800">支出明細</h3>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#bbdfff] text-slate-700 px-5 py-2 rounded-full font-black text-sm shadow-sm flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> 記一筆
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white/30 backdrop-blur-xl p-1.5 rounded-2xl border border-white/30 flex gap-1">
        {(['all', 'cash', 'credit'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${filter === t ? 'bg-white text-[#5A86C2] shadow-sm' : 'text-slate-400 hover:bg-white/40'}`}
          >
            {t === 'all' ? '全部' : t === 'cash' ? '現金' : '信用卡'}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-16 text-slate-500/60 text-sm font-bold italic">沒有相關的支出紀錄</div>
        ) : (
          filteredExpenses.map(exp => (
            <div key={exp.id} className="bg-white/60 backdrop-blur-md p-4 rounded-[24px] border border-white/40 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${exp.paymentMethod === 'cash' ? 'bg-green-100' : 'bg-purple-100'}`}>
                  {exp.paymentMethod === 'cash' ? '💵' : '💳'}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800">{exp.item}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{exp.date} • {exp.paymentMethod === 'cash' ? '現金' : '信用卡'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-black text-slate-800">¥{exp.amount.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-slate-400">$ {(exp.amount * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })} TWD</div>
                </div>
                <button onClick={() => deleteExpense(exp.id)} className="text-slate-300 hover:text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsAdding(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-black text-slate-800 text-center">新增支出</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">品項</label>
                  <input 
                    type="text" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="例如：拉麵"
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#bbdfff]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">金額</label>
                  <input 
                    type="number" 
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-[#bbdfff]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">幣別</label>
                  <div className="bg-slate-50 rounded-2xl p-1 flex gap-1">
                    {(['JPY', 'TWD'] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => setNewCurrency(c)}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${newCurrency === c ? 'bg-white text-[#5A86C2] shadow-sm' : 'text-slate-400'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">支付方式</label>
                  <div className="flex gap-2">
                    {(['cash', 'credit'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition-all border-2 ${paymentMethod === m ? 'bg-[#bbdfff] border-[#bbdfff] text-slate-700' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                        {m === 'cash' ? '現金' : '信用卡'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-sm text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={addExpense}
                  className="flex-2 py-4 rounded-2xl font-black text-sm text-slate-700 bg-[#bbdfff] shadow-md active:scale-95 transition-all"
                >
                  確認新增
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShoppingPage = ({
  items,
  setItems
}: {
  items: ShoppingItem[],
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>
}) => {
  const [newName, setNewName] = useState("");
  const [newStore, setNewStore] = useState("");

  const addItem = () => {
    if (!newName) return;
    setItems([{ id: Date.now().toString(), name: newName, price: newStore, isBought: false }, ...items]);
    setNewName("");
    setNewStore("");
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, isBought: !item.isBought } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex items-center justify-between border-l-4 border-[#ffdda5] pl-3 mb-2">
        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest">Shopping List</h2>
      </div>

      <section className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/40 shadow-sm">
        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="想買的東西..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 bg-slate-50/50 border-none rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#bbdfff]"
          />
          <input 
            type="text" 
            placeholder="店家/地點"
            value={newStore}
            onChange={(e) => setNewStore(e.target.value)}
            className="w-24 bg-slate-50/50 border-none rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#bbdfff]"
          />
          <button 
            onClick={addItem}
            className="bg-[#bbdfff] text-slate-700 p-2 rounded-xl active:scale-90 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-300 text-sm italic">購物清單空空如也</div>
          ) : (
            items.map(item => (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${item.isBought ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-white/40 shadow-sm'}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleItem(item.id)} className="text-[#5A86C2]">
                    {item.isBought ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div>
                    <div className={`text-sm font-bold ${item.isBought ? 'line-through text-slate-400' : 'text-slate-800'}`}>{item.name}</div>
                    {item.price && <div className="text-[10px] text-[#5A86C2] font-bold flex items-center gap-1 uppercase tracking-wider"><MapPin className="w-2 h-2" /> {item.price}</div>}
                  </div>
                </div>
                <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const InfoPage = () => {
  const emergencyContacts = [
    { name: "警察局 (Police)", number: "110", icon: "👮" },
    { name: "救護車/火警 (Ambulance/Fire)", number: "119", icon: "🚑" },
    { name: "海上保安廳 (Coast Guard)", number: "118", icon: "⚓" },
    { name: "日本救助熱線 (Japan Help Line)", number: "0570-000-911", icon: "🆘" },
    { name: "台北駐日經濟文化代表處", number: "03-3280-7811", icon: "🇹🇼" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex items-center gap-2 border-l-4 border-[#ffdda5] pl-3 mb-2">
        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest">Maps & Info</h2>
      </div>

      {/* Google Maps Section */}
      <section className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border border-white/40 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#5A86C2]">
          <Navigation className="w-5 h-5" />
          <h3 className="text-[10px] font-black uppercase tracking-wider">地圖導航</h3>
        </div>
        <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-2">
          <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop" 
            alt="Map Preview" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <MapPin className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
        <a 
          href="https://www.google.com/maps/search/?api=1&query=Fukuoka"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#bbdfff] text-slate-700 py-4 rounded-2xl font-black text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" /> 開啟 Google 地圖 (福岡)
        </a>
      </section>

      {/* Emergency Contacts */}
      <section className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border border-white/40 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-red-400">
          <MapPin className="w-5 h-5" />
          <h3 className="text-[10px] font-black uppercase tracking-wider">緊急聯絡資訊</h3>
        </div>
        <div className="space-y-3">
          {emergencyContacts.map((contact, idx) => (
            <a 
              key={idx}
              href={`tel:${contact.number.replace(/-/g, '')}`}
              className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/60 hover:bg-white/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{contact.icon}</div>
                <div>
                  <div className="text-sm font-black text-slate-800">{contact.name}</div>
                  <div className="text-[10px] font-bold text-slate-400">{contact.number}</div>
                </div>
              </div>
              <div className="w-8 h-8 bg-[#bbdfff]/10 rounded-full flex items-center justify-center text-[#5A86C2] group-hover:bg-[#bbdfff] group-hover:text-slate-700 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default function App() {
  // --- Persistent UI State ---
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'shopping' | 'info'>(() => {
    return (localStorage.getItem('fukuoka_active_tab') as any) || 'itinerary';
  });
  const [activeDay, setActiveDay] = useState(() => {
    const saved = localStorage.getItem('fukuoka_active_day');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isAddingBudget, setIsAddingBudget] = useState(false);

  // --- Persistent Data State ---
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 1. Initial Load - Run only once
  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem('fukuoka_expenses');
      const savedShopping = localStorage.getItem('fukuoka_shopping');
      const savedTab = localStorage.getItem('fukuoka_active_tab');
      const savedDay = localStorage.getItem('fukuoka_active_day');

      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedShopping) setShoppingItems(JSON.parse(savedShopping));
      if (savedTab) setActiveTab(savedTab as any);
      if (savedDay) setActiveDay(parseInt(savedDay, 10));
      
      console.log("Data loaded from localStorage");
      setIsDataLoaded(true);
    } catch (e) {
      console.error("Failed to load data", e);
      setIsDataLoaded(true);
    }
  }, []);

  // 2. Save on changes - Only after initial load is complete
  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('fukuoka_expenses', JSON.stringify(expenses));
  }, [expenses, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('fukuoka_shopping', JSON.stringify(shoppingItems));
  }, [shoppingItems, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('fukuoka_active_tab', activeTab);
  }, [activeTab, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('fukuoka_active_day', activeDay.toString());
  }, [activeDay, isDataLoaded]);

  useEffect(() => {
    if (selectedAttraction || isAddingBudget) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedAttraction, isAddingBudget]);

  const currentDay = ITINERARY_DATA[activeDay];

  return (
    <div className="min-h-screen bg-[#FFFAF0] font-sans text-slate-800 flex flex-col relative">
      <main className="flex-1 overflow-y-scroll relative z-10 no-scrollbar sm:scrollbar-auto">
        {activeTab === 'itinerary' && (
          <div className="animate-in fade-in duration-500">
            {/* --- Hero Banner --- */}
            <div className="relative h-[25vh] min-h-[180px] w-full overflow-hidden">
              <img 
                src="https://www.wendyjourney.com/wp-content/uploads/2025/05/Fukuoka.jpg" 
                alt="Fukuoka Banner" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFAF0] via-transparent to-black/5" />
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-4 pb-32">
              {/* Day Selector */}
              <div className="flex gap-2">
                {ITINERARY_DATA.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDay(idx)}
                    className={`flex-1 h-16 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${activeDay === idx ? 'bg-[#bbdfff] border-[#bbdfff] text-slate-700 shadow-md' : 'bg-white border-[#ffdda5]/30 text-slate-400'}`}
                  >
                    <span className="text-[10px] font-bold opacity-60 uppercase">D0{idx + 1}</span>
                    <span className="text-xs font-black">{day.date.split('/')[1]}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.section 
                  key={activeDay}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Weather Card */}
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{currentDay.weather.icon}</div>
                      <div>
                        <div className="text-xs font-black text-[#5A86C2]">{currentDay.weather.condition}</div>
                        <div className="text-xs font-bold text-slate-400">福岡市 • {currentDay.weather.temp}</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-[#5A86C2] bg-[#bbdfff]/30 px-3 py-1 rounded-full uppercase tracking-widest">
                      Weather
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-l-4 border-[#ffdda5] pl-3">
                    <h2 className="text-base font-black text-slate-800">{currentDay.day}</h2>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Itinerary</span>
                  </div>

                  <div className="space-y-4">
                    {currentDay.attractions.map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => item.type !== 'flight' && setSelectedAttraction(item)} 
                        className={item.type !== 'flight' ? "cursor-pointer" : ""}
                      >
                        <AttractionCard item={item} />
                      </div>
                    ))}
                  </div>
                </motion.section>
              </AnimatePresence>
            </div>
          </div>
        )}

        {(activeTab === 'budget' || activeTab === 'shopping' || activeTab === 'info') && (
          <div className="max-w-4xl mx-auto p-4 md:p-8 pt-8">
            {activeTab === 'budget' && (
              <BudgetPage 
                isAdding={isAddingBudget} 
                setIsAdding={setIsAddingBudget} 
                expenses={expenses}
                setExpenses={setExpenses}
              />
            )}
            {activeTab === 'shopping' && (
              <ShoppingPage 
                items={shoppingItems}
                setItems={setShoppingItems}
              />
            )}
            {activeTab === 'info' && <InfoPage />}
          </div>
        )}
      </main>

      {/* --- Detail Modal --- */}
      <AnimatePresence>
        {selectedAttraction && (
          <div 
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedAttraction(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>

              <div className="relative h-48 sm:h-64 w-full flex-shrink-0">
                <img 
                  src={selectedAttraction.image || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop"} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedAttraction(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-20"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto flex-1 no-scrollbar">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">{selectedAttraction.name}</h3>
                  <span className="text-xs font-bold text-slate-600 bg-[#bbdfff] px-3 py-1 rounded-full">{selectedAttraction.time}</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Clock className="w-4 h-4" /> {selectedAttraction.duration}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <MapPin className="w-4 h-4" /> 福岡
                  </div>
                </div>

                {selectedAttraction.type === 'dinner' && selectedAttraction.subItems ? (
                  <div className="space-y-4 mt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">人氣推薦清單</p>
                    {selectedAttraction.subItems.map((sub, sIdx) => (
                      <div key={sIdx} className="bg-[#FFFAF0] p-4 rounded-2xl border border-[#ffdda5]/30">
                        <div className="text-xs font-black text-slate-800 mb-1">{sub.name}</div>
                        <div className="text-xs font-bold text-[#5A86C2] mb-1">{sub.time}</div>
                        <p className="text-xs text-slate-500 leading-tight">{sub.note}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedAttraction.description}
                  </p>
                )}

                {selectedAttraction.type !== 'hotel' && selectedAttraction.type !== 'dinner' && (
                  <div className="pt-4">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAttraction.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#bbdfff] text-slate-700 py-4 rounded-2xl font-black text-center flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-5 h-5" /> 開啟 Google 地圖導航
                    </a>
                  </div>
                )}
                
                {selectedAttraction.type === 'hotel' && (
                  <div className="pt-4 space-y-3">
                    <div className="bg-[#bbdfff]/10 p-4 rounded-2xl border border-[#bbdfff]/30">
                      <div className="text-xs font-black text-[#5A86C2] uppercase mb-1">飯店資訊</div>
                      <div className="text-xs text-slate-600 font-medium">含早餐！要步要吃都可以！</div>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAttraction.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#bbdfff] text-slate-700 py-4 rounded-2xl font-black text-center flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-5 h-5" /> 查看飯店位置
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Bottom Navigation Tab Bar (Fixed Floating Pill Style) --- */}
      {!isAddingBudget && !selectedAttraction && (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-6 flex justify-center">
          <nav className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/40 rounded-full p-2 flex justify-between items-center shadow-xl">
            <button 
              onClick={() => setActiveTab('itinerary')}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-full transition-all duration-300 ${activeTab === 'itinerary' ? 'bg-[#bbdfff] text-slate-700 shadow-sm' : 'text-slate-400 hover:bg-[#bbdfff]/20'}`}
            >
              <Calendar className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">行程</span>
            </button>
            <button 
              onClick={() => setActiveTab('budget')}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-full transition-all duration-300 ${activeTab === 'budget' ? 'bg-[#bbdfff] text-slate-700 shadow-sm' : 'text-slate-400 hover:bg-[#bbdfff]/20'}`}
            >
              <Wallet className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">記帳</span>
            </button>
            <button 
              onClick={() => setActiveTab('shopping')}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-full transition-all duration-300 ${activeTab === 'shopping' ? 'bg-[#bbdfff] text-slate-700 shadow-sm' : 'text-slate-400 hover:bg-[#bbdfff]/20'}`}
            >
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">購物</span>
            </button>
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-full transition-all duration-300 ${activeTab === 'info' ? 'bg-[#bbdfff] text-slate-700 shadow-sm' : 'text-slate-400 hover:bg-[#bbdfff]/20'}`}
            >
              <Flower2 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">資訊</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
