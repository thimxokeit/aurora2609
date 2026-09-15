ㅣ/* 아이슬란드·핀란드 여행 — 앱 로직
   · 지도 + 일정 시트를 한 화면에 (peek 3행 / 끌어올리면 전체)
   · 맛집 카테고리는 단일 선택 필터 (누르면 그 카테고리만 표시)
   · 체크리스트 탭: localStorage로 체크 상태 저장
*/
(function () {
'use strict';

var DATA = {
  days: [
    { id:1, color:"#173355", theme:"레이캬비크 도착", date:"9/10 (목)", iso:"2026-09-10", stops:[
      { t:"07:50", name:"케플라비크(KEF) 공항 도착", lat:63.981487, lng:-22.628186, cat:"이동" },
      { t:"08:10", name:"Flybus 탑승 → BSÍ 버스터미널", lat:64.1372475, lng:-21.9349827, cat:"이동", note:"약 45분 소요" },
      { t:"09:15", name:"Luggage Lockers (Barónsstígur 47)에 짐 보관", lat:64.140915, lng:-21.922323, cat:"이동", note:"24시간 운영 · BSÍ보다 숙소 방향에 가까운 코인락커" },
      { t:"09:45", name:"Planta Kaffihús에서 아점", lat:64.142538, lng:-21.920516, cat:"카페", note:"화~일 8:00~17:00(월 휴무) · 비건 카페, 치즈번·커피 좋음" },
      { t:"11:00", name:"Hallgrímskirkja 구경", lat:64.1420229, lng:-21.9265494, cat:"관광", note:"매일 10:00~17:00" },
      { t:"11:45", name:"레인보우 거리(Skólavörðustígur)에서 기념품 구경", lat:64.144495, lng:-21.930386, cat:"쇼핑", note:"무지개 거리 · 상점·카페 밀집" },
      { t:"12:30", name:"Laugavegur 거리 구경 (Hard Rock Cafe, H&M 등) → The World of Icelandic Music까지", lat:64.149909, lng:-21.932813, cat:"쇼핑", note:"관람은 안 하고 비 피하며 구경만 함 · Hard Rock Cafe, H&M 매장 구경" },
      { t:"13:30", name:"Bernhöftsbakarí에서 빵 구매 (도넛, 치즈번)", lat:64.147926, lng:-21.926752, cat:"빵집", note:"목요일 7:30~17:00 · 레이캬비크에서 가장 오래된 베이커리" },
      { t:"14:00", name:"Vínbúðin에서 맥주·와인 구매", lat:64.147678, lng:-21.939615, cat:"쇼핑", note:"목요일 11:00~18:00, 일요일 휴무 · 아이슬란드는 국영주류점에서만 도수 있는 맥주 판매" },
      { t:"14:20", name:"SPAR (Barónsstígur)에서 장보기", lat:64.144547, lng:-21.918583, cat:"쇼핑", note:"24시간 운영" },
      { t:"15:00", name:"숙소 체크인 (Rauðarárstígur 7)", lat:64.1437875, lng:-21.9126406, cat:"이동", note:"Luggage Lockers에서 짐 찾아서 이동" },
      { t:"16:00", name:"Sundhöll Reykjavíkur — 수영장·온탕·사우나", lat:64.141829, lng:-21.920652, cat:"휴식", note:"목요일 15:00~22:00 · Hallgrímskirkja와 같은 건축가(Guðjón Samúelsson) 작품 · 성인 1,380 ISK · 수영복 대여 가능 · 탕 들어가기 전 알몸 샤워는 필수(성별 분리)" },
      { t:"19:30", name:"숙소에서 휴식 (오로라 투어 취소됨)", lat:64.1437875, lng:-21.9126406, cat:"이동", note:"악천후로 취소 · 무료 재예약 진행 → Day4로 이동" },
      { alt:true, t:"", name:"Café Loki", lat:64.142403, lng:-21.928852, cat:"식사", note:"쉬지 않았다면 · Lokastígur 28, 도보 5분, ~22시 · 램수프·호밀빵 아이스크림" },
      { alt:true, t:"", name:"Skúli Craft Bar", lat:64.147554, lng:-21.941615, cat:"나이트라이프", note:"쉬지 않았다면 · Aðalstræti 9, ~23시 · 아이슬란드 크래프트 맥주" }
    ]},
    { id:2, color:"#2A6F8E", theme:"빙하투어 (남부해안)", date:"9/11 (금)", iso:"2026-09-11", stops:[
      { t:"07:00", name:"투어 출발 (숙소 인근 픽업)", lat:64.1437875, lng:-21.9126406, cat:"이동", note:"정확한 픽업시간은 바우처로 재확인" },
      { t:"08:45", name:"Hvolsvöllur — 휴식 15분", lat:63.751113, lng:-20.222920, cat:"이동", note:"버스·코치 105분 이동 후 휴게" },
      { t:"09:20~09:50", name:"Seljalandsfoss — 사진촬영 30분", lat:63.615623, lng:-19.988569, cat:"관광", note:"실제 방문 시간 · 폭포 뒤로 걸어들어갈 수 있음 · 우비 필요" },
      { t:"11:30~12:00", name:"Kirkjubæjarklaustur — Stjórnarfoss 구경 & 점심", lat:63.789024, lng:-18.053116, cat:"식사", note:"Stjórnarfoss(주차장에서 도보 5분 이내) 구경 겸 점심" },
      { t:"13:30~15:00", name:"Jökulsárlón 빙하라군 & Diamond Beach", lat:64.078446, lng:-16.230554, cat:"관광", note:"실제 방문 시간 · 유빙·물범 관찰 · 보트크루즈 옵션(추가요금)" },
      { t:"15:55~16:05", name:"Skeiðará Bridge Monument", lat:63.984627, lng:-16.959378, cat:"관광", note:"돌아오는 길에 방문 · 1996년 빙하 홍수로 휘어진 다리 잔해, 짧은 포토스톱" },
      { t:"17:40~18:15", name:"Vík í Mýrdal — 저녁", lat:63.417650, lng:-18.997440, cat:"식사", note:"18:15 실제 출발 확인됨 · 도착시간은 추정" },
      { t:"20:30", name:"투어 종료, Bus Stop 12 Höfðatorg 하차", lat:64.1443797, lng:-21.9104986, cat:"이동", note:"실제 도착 시간 · 숙소까지 도보 2분" }
    ]},
    { id:3, color:"#4B3F91", theme:"자유시간 · 오로라#2", date:"9/12 (토)", iso:"2026-09-12", stops:[
      { t:"13:20", name:"Reykjavík Art Museum — Hafnarhús", lat:64.149139, lng:-21.940938, cat:"관광", move:"⭐Kjarvalsstaðir에서 시티 카드 수령 (숙소서 도보 9분) → 🚌 버스로 이동 (카드로 무료)", note:"24시간권이면 내일 13:00쯤까지 · 입장료 2,550 ISK 카드로 무료 · 매일 10-17(목~22) · Erró 상설전" },
      { t:"14:30", name:"Kolaportið 벼룩시장", lat:64.148933, lng:-21.938775, cat:"쇼핑", move:"바로 옆 건물, 도보 1분", note:"토·일 11:00~17:00만 운영 · 입장 무료" },
      { t:"15:30", name:"Old Harbour HOT DOGS", lat:64.151190, lng:-21.944257, cat:"간식", move:"도보 6분", note:"매일 11:00~20:00 · 핫도그·맥주" },
      { t:"16:15", name:"Marshall House — Kling & Bang · Living Art Museum(Nýlistasafnið)", lat:64.156255, lng:-21.939150, cat:"관광", move:"도보 12분 → 🚌 버스 (시티카드 무료)", note:"토요일 12:00~18:00 · 입장 무료(3개 갤러리 모두)" },
      { t:"18:30", name:"Sólfarið (Sun Voyager)", lat:64.147631, lng:-21.922285, cat:"관광", move:"🚌 버스 (시티카드 무료)", note:"24시간 무료 · 바이킹 배 형상 조각" },
      { t:"18:50", name:"Höfði 하우스", lat:64.151667, lng:-21.909167, cat:"관광", move:"Sæbraut 해안길 따라 도보 9분", note:"1986년 레이건-고르바초프 정상회담 장소 · 외관만 관람, 무료" },
      { t:"19:20", name:"숙소 복귀, 저녁은 집에서", lat:64.1437875, lng:-21.9126406, cat:"이동", move:"도보 8분" },
      { t:"20:30", name:"오로라 투어 픽업 장소로 이동", lat:64.1443797, lng:-21.9104986, cat:"이동", move:"도보 2분", note:"Bus Stop 12 Höfðatorg" },
      { t:"21:00~02:00", name:"오로라 투어 #2", lat:64.1437875, lng:-21.9126406, cat:"오로라", note:"Northern Lights Guided Tour" }
    ]},
    { id:4, color:"#26617F", theme:"자유시간 · 오로라 재도전", date:"9/13 (일)", iso:"2026-09-13", stops:[
      { t:"11:30", name:"National Museum of Iceland", lat:64.141615, lng:-21.948578, cat:"관광", move:"아침은 집에서 · 🚌 버스 (시티카드 무료)", note:"⏰13:00 Ásmundarsafn 개장 맞추려면 12:35 출발 → 약 1시간만 관람 가능 · 입장료 약 2,500 ISK 카드 커버" },
      { t:"13:00", name:"Ásmundarsafn (개장과 동시에 입장)", lat:64.141631, lng:-21.885167, cat:"관광", move:"🚌 버스 약 20분 (시티카드 무료 — 13:30 만료 직전)", note:"매일 13:00~17:00 · 입장료 카드 커버 · 조각가 Ásmundur Sveinsson 미술관 · 야외 조각정원은 티켓 없이도 무료" },
      { t:"14:30", name:"Braud & Co (Laugavegur 180)에서 빵 구매", lat:64.140238, lng:-21.895288, cat:"빵집", move:"도보 7분 (돌아오는 길)", note:"⚠️ 일요일 15:00 마감 — Ásmundarsafn에서 14:15엔 나오기 · 내일 비행기용" },
      { t:"15:00", name:"Reykjavík Roasters (Brautarholt 2)", lat:64.141668, lng:-21.911438, cat:"카페", move:"도보 10분", note:"일요일 7:00~17:00 · Kárastígur 본점보다 좌석 많고 작업하기 좋음" },
      { t:"16:00", name:"숙소에서 짐 정리", lat:64.1437875, lng:-21.9126406, cat:"이동", move:"도보 4분", note:"04:00 Flybus까지 그대로 들고 나갈 상태로" },
      { t:"19:00", name:"숙소에서 저녁", lat:64.1437875, lng:-21.9126406, cat:"식사", note:"SPAR에서 산 재료로 간단히" },
      { t:"21:30~약02:00", name:"오로라 투어 (Day1 취소분 재예약)", lat:64.1437875, lng:-21.9126406, cat:"오로라", note:"⚠️ 투어 종료~04:00 Flybus 픽업까지 휴식시간이 약 2시간뿐" },
      { t:"04:00(+1)", name:"Flybus 픽업 (다음날 새벽)", lat:64.1443797, lng:-21.9104986, cat:"이동", note:"바로 이어지는 일정이니 투어 중에도 시간 체크" }
    ]},
    { id:5, color:"#7A4E97", theme:"아이슬란드 → 헬싱키", date:"9/14 (월)", iso:"2026-09-14", stops:[
      { t:"04:00", name:"Flybus 숙소 픽업 (Bus Stop 12 Höfðatorg)", lat:64.1443797, lng:-21.9104986, cat:"이동", note:"픽업 시작 04:00 · 출발 04:30 (예약 확정 IF-U9XYWG)" },
      { t:"04:45", name:"케플라비크(KEF) 공항 도착", lat:63.981487, lng:-22.628186, cat:"이동", note:"45분 소요 · 08:35 출발까지 여유 있음" },
      { t:"08:35", name:"KEF 출발 (AY0992)", lat:63.981487, lng:-22.628186, cat:"이동" },
      { t:"15:00", name:"헬싱키(HEL) 도착", lat:60.317945, lng:24.949624, cat:"이동", note:"Schengen 역내 이동, 입국심사 없음" },
      { t:"17:30", name:"숙소 체크인 (Korkeavuorenkatu 3)", lat:60.160012, lng:24.947378, cat:"이동", move:"🚆 공항열차 I/P → 중앙역 30분 (ABC권 €4.80) → 🚋 트램 10번 또는 도보 18분" },
      { t:"18:15", name:"Esplanadi 공원 · Kauppatori 항구 산책", lat:60.167665, lng:24.953678, cat:"관광", move:"도보 11분", note:"월요일 저녁은 실내 대부분 18시 마감 · 야외 산책로는 상시 개방 · 좌판은 이미 정리됨" },
      { t:"19:15", name:"Alepa Ullanlinna에서 장보기", lat:60.159399, lng:24.945639, cat:"쇼핑", move:"도보 13분 (귀가 방향)", note:"매일 6:30~23:00 · 숙소서 도보 3분 · 5.5% 이하 맥주·롱드링크는 21시까지만 판매" },
      { t:"19:45", name:"숙소에서 저녁", lat:60.160012, lng:24.947378, cat:"식사", move:"도보 3분" },
      { alt:true, t:"", name:"Restaurant Sea Horse", lat:60.158666, lng:24.946446, cat:"식사", note:"외식했다면 · 숙소 도보 3분 · 월~화 12:00~22:00 · 1934년부터, 미트볼·청어·연어수프" },
      { alt:true, t:"", name:"Allas Sea Pool", lat:60.167100, lng:24.957162, cat:"휴식", note:"월~금 ~21:00 · 바다 사우나, 수영복 대여 가능" }
    ]},
    { id:6, color:"#1F5AA8", theme:"헬싱키 도보 투어 코스", date:"9/15 (화)", iso:"2026-09-15", stops:[
      { t:"09:30", name:"상원광장 · 헬싱키 대성당", lat:60.169479, lng:24.952287, cat:"관광", move:"숙소에서 도보 16분", note:"24시간 개방 무료 · 대성당 계단에서 광장 전망 · 내부 무료(기부금)" },
      { t:"10:15", name:"핀란드 국립도서관", lat:60.170388, lng:24.950388, cat:"관광", move:"바로 옆, 도보 2분", note:"화요일 9:00~18:00 · 무료 · 1640년부터, 화려한 열람실 내부" },
      { t:"10:45", name:"우스펜스키 대성당", lat:60.168602, lng:24.959897, cat:"관광", move:"도보 10분", note:"화요일 9:30~16:00 · 북유럽 최대 정교회 · 언덕 위라 항구 전망 좋음" },
      { t:"11:15", name:"하비스 아만다 분수 · 마켓스퀘어", lat:60.167591, lng:24.951404, cat:"관광", move:"도보 8분", note:"24시간 무료 · Day5 저녁에 지나간 곳이지만 분수는 놓쳤을 수도" },
      { t:"12:00", name:"Oodi 도서관", lat:60.173683, lng:24.937919, cat:"관광", move:"도보 15분", note:"화요일 8:00~21:00 · 무료 입장" },
      { t:"13:00", name:"점심 — Kosmos", lat:60.168003, lng:24.939650, cat:"식사", move:"도보 8분", note:"화요일 11:30~24:00 · 1924년부터 · 아르데코 인테리어, 예술가 단골집 · 순록·블리니·랍스터수프 · 예약 권장" },
      { alt:true, t:"", name:"Restaurant Fisken på Disken", lat:60.169378, lng:24.933887, cat:"식사", note:"Kosmos에서 도보 6분 · 화요일 11:00~22:00 · 연어수프(Lohikeitto) 원조로 유명, 핀란드 전역 카피 레시피의 원본" },
      { alt:true, t:"", name:"Lappi Ravintola", lat:60.166681, lng:24.936945, cat:"식사", note:"Kosmos에서 도보 4분 · 화요일 16:00~22:00(점심 불가) · 순록·연어수프 · 평점 4.5(2,702) · 저녁으로 바꾸면 여기 추천" },
      { alt:true, t:"", name:"Savoy", lat:60.166977, lng:24.947335, cat:"식사", note:"화요일 점심 11:30~16:00 · Alvar Aalto 설계 인테리어 · 파인다이닝, 가장 비쌈" },
      { t:"14:00", name:"Moomin Shop Forum · S-market에서 선물 쇼핑", lat:60.169307, lng:24.938046, cat:"쇼핑", move:"바로 근처, 도보 2분", note:"Moomin Shop: 머그컵·에코백 등 캐릭터 굿즈 · S-market(24시간, 도보 3분): 자일리톨 껌·치약, Fazer 초콜릿, Läkerol·살미아키 민트 — 팀 선물용으로 무난" },
      { t:"14:30", name:"Kiasma 컨템포러리 아트뮤지엄", lat:60.171591, lng:24.936864, cat:"관광", move:"도보 6분", note:"화요일 10:00~20:00 · 월요일 휴관" },
      { t:"15:30", name:"Design District 쇼핑", lat:60.160609, lng:24.946688, cat:"쇼핑", move:"🚋 트램 10분 또는 도보 18분", note:"매장 대부분 ~18시" },
      { t:"17:00", name:"Kallio 교회 · 동네 산책", lat:60.184324, lng:24.949357, cat:"관광", move:"🚋 트램 3/9번 약 15분 (AB권)", note:"언덕 위 랜드마크 · 헬싱키 전망" },
      { t:"18:30", name:"숙소 복귀 · 저녁은 집에서", lat:60.160012, lng:24.947378, cat:"식사", move:"🚋 트램 약 20분 (AB권)", note:"필요하면 Alepa Ullanlinna(도보 3분, ~23시)에서 장보기" },
      { alt:true, t:"", name:"Restaurant BLINIt", lat:60.187901, lng:24.945057, cat:"식사", note:"외식했다면 · Kallio에서 도보 8분 · 매일 12:00~22:00 · 블리니·보르시" },
      { alt:true, t:"", name:"Saigon Bistro", lat:60.186453, lng:24.951620, cat:"식사", note:"외식했다면 · Kallio · 평점 4.9 · 화요일 ~20시 마감" }
    ]},
    { id:7, color:"#4E6E8A", theme:"헬싱키 → 한국", date:"9/16 (수)", iso:"2026-09-16", stops:[
      { t:"09:30", name:"Temppeliaukio 암석교회", lat:60.173025, lng:24.925235, cat:"관광", move:"🚋 트램 약 15분 (AB권 €3.20)", note:"수요일 9:00~17:00 · €8 · 암반을 파서 만든 교회, 음향이 뛰어나 콘서트도 열림" },
      { alt:true, t:"", name:"건축·디자인 박물관", lat:60.163032, lng:24.946391, cat:"관광", note:"수요일 11:00~18:00 · 숙소서 도보 3분 · 무민 전시 있음 · 단 11시 개관이라 1시간만 가능 · 우스펜스키 성당은 Day6에 이미 방문" },
      { t:"11:15", name:"숙소 복귀 · 짐 정리", lat:60.160012, lng:24.947378, cat:"이동", move:"🚋 트램 15분" },
      { t:"12:00", name:"숙소 체크아웃", lat:60.160012, lng:24.947378, cat:"이동" },
      { t:"12:15", name:"점심 — Fazer Café", lat:60.168647, lng:24.947674, cat:"식사", move:"도보 12분", note:"역 가는 길 · 매일 7:30~22:00" },
      { t:"13:30", name:"헬싱키 중앙역 도착", lat:60.171873, lng:24.941422, cat:"이동", move:"도보 8분" },
      { t:"13:40", name:"공항행 열차(Ring Rail I/P) 탑승", lat:60.171873, lng:24.941422, cat:"이동", move:"ABC권 €4.80 · 약 30분", note:"⚠️ 2026년 I·P선 공사로 감축 운행 이력 있음 — 전날 HSL 앱에서 운행 확인 · 대체편은 600번 버스(24시간 운행, 같은 ABC권)" },
      { t:"14:10", name:"헬싱키 공항(HEL) 도착", lat:60.317945, lng:24.949624, cat:"이동", note:"17:30 출발까지 약 3시간20분 여유" },
      { t:"17:30", name:"HEL 출발 (AY0041)", lat:60.317945, lng:24.949624, cat:"이동" }
    ]},
    { id:8, color:"#7A4E97", theme:"한국 도착", date:"9/17 (목)", iso:"2026-09-17", stops:[
      { t:"11:20", name:"인천(ICN) 도착", lat:37.4602, lng:126.4407, cat:"이동" }
    ]}
  ],
  food: [
    { n:"Reykjavík Roasters", c:"카페", lat:64.1436111, lng:-21.9266667, r:4.6, h:"매일 7:00~17:00", m:"자가배전 · 시내 중심" },
    { n:"Reykjavík Roasters (Brautarholt 2)", c:"카페", lat:64.141668, lng:-21.911438, r:4.6, h:"매일 7:00~17:00", m:"좌석 많고 작업하기 좋음 · 숙소에서 도보 4분" },
    { n:"Braud & Co", c:"빵집", lat:64.1440791, lng:-21.9259781, r:4.8, h:"매일 6:30~17:00", m:"시나몬번 유명 · 좌석 적음" },
    { n:"Braud & Co (Laugavegur 180)", c:"빵집", lat:64.140238, lng:-21.895288, r:4.8, h:"평일 7:30~16:00, 주말 8:00~15:00", m:"동쪽 지점 · N1 주유소와 한 건물 · 주말 마감 이르니 주의" },
    { n:"Sandholt", c:"빵집", lat:64.1450318, lng:-21.9263398, r:4.6, h:"매일 7:30~18:00", m:"브런치 겸 베이커리 · 대기 있음 · Braud & Co 마감 놓쳤을 때 대안" },
    { n:"BakaBaka", c:"빵집", lat:64.146972, lng:-21.935733, r:4.4, h:"매일 8:00~22:00 (금·토 ~23:00)", m:"늦게까지 여는 베이커리 · 카다멈번·아몬드 크루아상 · 저녁엔 피자·와인바" },
    { n:"Bæjarins Beztu Pylsur", c:"간식", lat:64.1481882, lng:-21.9378861, r:4.4, h:"매일 9:00~ (요일별 마감 상이)", m:"아이슬란드 대표 핫도그 · 항상 줄" },
    { n:"Vínyl Bistro (Kaffi Vínyl)", c:"카페", lat:64.1449656, lng:-21.9223586, r:4.6, h:"", m:"비건 전문 · 레코드 인테리어" },
    { n:"Café Loki", c:"식사", lat:64.1424027, lng:-21.9288523, r:4.5, h:"매일 8:00~22:00", m:"전통 아이슬란드 음식 · 램수프·호밀빵아이스크림, 교회 바로 옆" },
    { n:"Messinn", c:"식사", lat:64.1465831, lng:-21.9377268, r:4.6, h:"매일 11:30~22:00", m:"해산물 전문 · 예약 권장 · 갑각류 메뉴 많으니 생선요리로 주문" },
    { n:"Kolaportið 벼룩시장", c:"쇼핑", lat:64.1489329, lng:-21.9387749, r:4.0, h:"토·일 11:00~17:00만", m:"빈티지·수공예품, 평일 휴무" },
    { n:"Marshall House (Kling & Bang · Living Art Museum)", c:"관광", lat:64.1562553, lng:-21.9391502, r:4.4, h:"화·수·금·토·일 12:00~18:00, 목 12:00~21:00, 월 휴무", m:"Kling & Bang, Living Art Museum(Nýlistasafnið), Studio Ólafur Elíasson 3곳 · 전부 무료입장" },
    { n:"Reykjavík Art Museum (Hafnarhús)", c:"관광", lat:64.149139, lng:-21.940938, r:4.3, h:"매일 10:00~17:00 (목 ~22:00)", m:"컨템포러리 아트 · Erró 상설전" },
    { n:"National Gallery of Iceland", c:"관광", lat:64.144157, lng:-21.938863, r:4.2, h:"매일 10:00~17:00", m:"기획전 중심 · House of Collections 동시 입장 · 입장료 약 1,700 ISK · 시티카드 커버" },
    { n:"National Museum of Iceland", c:"관광", lat:64.141615, lng:-21.948578, r:4.5, h:"매일 10:00~17:00", m:"아이슬란드 정착사~현대 통사 · 입장료 약 2,500 ISK · 시티카드 커버 · 카페·무료 라커 있음" },
    { n:"Ásmundarsafn", c:"관광", lat:64.141631, lng:-21.885167, r:4.6, h:"매일 13:00~17:00", m:"조각가 Ásmundur Sveinsson의 집·작업실 · 입장료 2,550 ISK(3개 지점 공통) · 야외 조각정원 무료" },
    { n:"Reykjavík Art Museum (Kjarvalsstaðir)", c:"관광", lat:64.137915, lng:-21.913477, r:4.4, h:"매일 10:00~17:00", m:"Klambratún 공원 안 · Kjarval 상설전 · 입장료 2,550 ISK(3개 지점 공통) · 시티카드 수령처 · 카페 평 좋음" },
    { n:"The Settlement Exhibition", c:"관광", lat:64.147399, lng:-21.942501, r:4.5, h:"매일 10:00~17:00", m:"1000년 전 롱하우스 발굴 유적 · 입장료 약 2,500 ISK · 시티카드 커버 및 수령처" },
    { n:"Sólfarið (Sun Voyager)", c:"관광", lat:64.147631, lng:-21.922285, r:4.6, h:"24시간", m:"해안가 바이킹 배 형상 조각 · 무료" },
    { n:"Höfði 하우스", c:"관광", lat:64.151667, lng:-21.909167, r:4.4, h:"외관만 상시", m:"1986년 레이건-고르바초프 정상회담 장소 · 무료 · Sólfarið에서 도보 9분" },
    { n:"Akkeri við Nýjabæjarvör", c:"관광", lat:64.160321, lng:-22.003841, r:4.4, h:"24시간", m:"Seltjarnarnes 북쪽 해안 · 11번 버스 30분 · 맑으면 Snæfellsjökull 빙하, Grótta 등대 원경 · 오로라 명소" },
    { n:"Grótta 등대", c:"관광", lat:64.163889, lng:-22.021389, r:4.7, h:"24시간 (둑길은 조수 영향)", m:"Seltjarnarnes 반도 끝 · 등대까지 가려면 물때 확인 필수 · Kvika 족욕탕 근처" },
    { n:"Old Harbour HOT DOGS", c:"간식", lat:64.151190, lng:-21.944257, r:4.7, h:"매일 11:00~20:00", m:"Bæjarins Beztu보다 한적함 · 항구 끝자락 위치" },
    { n:"Saga Museum", c:"관광", lat:64.152547, lng:-21.951344, r:4.3, h:"매일 10:00~17:00", m:"바이킹 역사 체험형 · 오디오가이드 · 코스튬 촬영 가능" },
    { n:"Hallgrímskirkja", c:"관광", lat:64.1420229, lng:-21.9265494, r:4.6, h:"매일 10:00~17:00", m:"전망대 유료 · 랜드마크" },
    { n:"Harpa", c:"관광", lat:64.1502464, lng:-21.9322805, r:4.6, h:"매일 10:00~18/20:00", m:"건축·공연장 · 무료 관람 가능" },
    { n:"Mokka Kaffi", c:"카페", lat:64.146003, lng:-21.932405, r:4.5, h:"매일 9:00~18:00", m:"1958년 · 레이캬비크 최고(最古) 카페 · 와플 유명" },
    { n:"Planta Kaffihús", c:"카페", lat:64.142538, lng:-21.920516, r:4.8, h:"화~일 8:00~17:00 (월 휴무)", m:"비건 카페 · 치즈번·수프 좋음" },
    { n:"The World of Icelandic Music", c:"관광", lat:64.149909, lng:-21.932813, r:5.0, h:"매일 10:00~20:00", m:"아이슬란드 음악사 인터랙티브 전시 · Harpa 근처" },
    { n:"Bernhöftsbakarí", c:"빵집", lat:64.147926, lng:-21.926752, r:4.7, h:"평일 7:30~17:00, 주말 8:00~16:00", m:"레이캬비크에서 가장 오래된 베이커리 · 도넛·치즈번" },
    { n:"Vínbúðin (Austurstræti)", c:"쇼핑", lat:64.147678, lng:-21.939615, r:4.3, h:"월~토 11:00~18/19:00, 일요일 휴무", m:"국영 주류 전문점 · 아이슬란드는 여기서만 맥주·와인·양주 구매 가능" },
    { n:"Stjórnarfoss", c:"관광", lat:63.799752, lng:-18.061301, r:4.7, h:"", m:"Kirkjubæjarklaustur 주차장에서 도보 5분 · 사람 적고 조용한 폭포" },
    { n:"Skeiðará Bridge Monument", c:"관광", lat:63.984627, lng:-16.959378, r:4.2, h:"24시간", m:"1996년 빙하 홍수로 휘어진 다리 잔해 · 도로변 짧은 포토스톱" },
    { n:"Sundhöll Reykjavíkur", c:"휴식", lat:64.141829, lng:-21.920652, r:4.7, h:"평일 6:30~22:00(요일별 상이), 주말 8:00~22:00", m:"1937년 · Hallgrímskirkja와 같은 건축가 설계 · 수영장+온탕+사우나 · 수영복 대여 가능" },
    { n:"Húrra", c:"나이트라이프", lat:64.1468123, lng:-21.9319778, r:4.3, h:"", m:"라이브뮤직 바 · 당일 라인업 확인 필요" },
    { n:"Skúli Craft Bar", c:"나이트라이프", lat:64.147554, lng:-21.941615, r:4.6, h:"매일 12:00~23:00 (목~토 ~01:00)", m:"레이캬비크 대표 크래프트 맥주바 · 테이스팅 플라이트 추천" },
    { n:"Skólavörðustígur", c:"쇼핑", lat:64.1444948, lng:-21.9303862, r:4.6, h:"", m:"무지개 거리 · 상점·카페 밀집" },
    { n:"Oodi 도서관", c:"관광", lat:60.1736833, lng:24.9379191, r:4.8, h:"월~금 8:00~21:00, 토·일 10:00~20:00", m:"현대 건축 · 무료 입장" },
    { n:"Kiasma", c:"관광", lat:60.1715911, lng:24.9368643, r:4.2, h:"화 10-20, 수·목 10-18, 금·토 10-20/17, 일 10-17, 월 휴관", m:"컨템포러리 아트뮤지엄" },
    { n:"Design District Helsinki", c:"쇼핑", lat:60.1606089, lng:24.9466883, r:3.7, h:"매장별 상이, 대체로 평일 10-19", m:"스칸디나비아 디자인숍 밀집" },
    { n:"Kallio 교회", c:"관광", lat:60.1843236, lng:24.9493571, r:4.5, h:"", m:"언덕 위 랜드마크 · 헬싱키 전망" },
    { n:"Cafe Regatta", c:"카페", lat:60.1801568, lng:24.9117599, r:4.6, h:"매일 9:00~21:00", m:"해변 오두막 카페 · 시나몬번" },
    { n:"Fazer Café", c:"카페", lat:60.1686468, lng:24.9476736, r:4.4, h:"매일 7:30~22:00 (일 10-20)", m:"파제르 초콜릿 본점 카페" },
    { n:"Restaurant Story", c:"식사", lat:60.1661689, lng:24.9528382, r:4.2, h:"매일 8:00~17:00", m:"미트볼·순록 요리 · 올드마켓홀 근처" },
    { n:"Kappeli", c:"식사", lat:60.1673860, lng:24.9503230, r:4.4, h:"매일 10:00~23/24:00", m:"1867년부터 · 온실 건물 · 엘크스테이크" },
    { n:"Restaurant Sea Horse", c:"식사", lat:60.158666, lng:24.946446, r:4.4, h:"월~화 12:00~22:00, 수~금 ~23:00, 토 15-23, 일 15-22", m:"1934년부터 · 미트볼·청어·연어수프 · 숙소 도보 3분 · 예약 권장" },
    { n:"Restaurant Zetor", c:"식사", lat:60.169377, lng:24.940802, r:4.2, h:"월·화·목 15:00~23:30, 수 ~02:00, 금·토 ~04:30, 일 13-23:30", m:"트랙터 테마 · 순록스테이크·연어수프 · 관광객 많음" },
    { n:"Kosmos", c:"식사", lat:60.168003, lng:24.939650, r:4.3, h:"월~금 11:30~24:00, 토 16-24, 일 휴무", m:"1924년부터 · 아르데코 인테리어 · 순록·블리니·랍스터수프 · 예약 권장" },
    { n:"Savoy", c:"식사", lat:60.166977, lng:24.947335, r:4.7, h:"월~금 11:30~16:00 / 18:00~24:00, 토 18-24, 일 휴무", m:"Alvar Aalto 1937년 설계 인테리어 · 파인다이닝 · 예약 필수 · 에스플라나디 전망" },
    { n:"Restaurant Elite", c:"식사", lat:60.176569, lng:24.922915, r:4.5, h:"월·화 12:00~22:00, 수~금 ~23:00, 토 13-23, 일 13-22", m:"1932년 예술가 레스토랑 · Töölö 지역" },
    { n:"Alepa Ullanlinna", c:"쇼핑", lat:60.159399, lng:24.945639, r:4.0, h:"월~토 6:30~23:00, 일 9:00~23:00", m:"숙소 도보 3분 · 5.5% 이하 주류는 21시까지 판매" },
    { n:"Konstan Möljä", c:"식사", lat:60.163985, lng:24.926793, r:4.5, h:"화~금 11-14:30/17-22, 토 16-23, 일·월 휴무", m:"전통 핀란드 뷔페 · 정액제 · 월요일 휴무 주의" },
    { n:"Restaurant Fisken på Disken", c:"식사", lat:60.169378, lng:24.933887, r:4.5, h:"화~금 11:00~22:00, 토 12-22, 월·일 휴무", m:"Kamppi 쇼핑몰 5층 · 연어수프(Lohikeitto)가 핀란드 전역 카피 레시피의 원조" },
    { n:"Lappi Ravintola", c:"식사", lat:60.166681, lng:24.936945, r:4.5, h:"월~토 16:00~22:00, 일 휴무", m:"순록·연어수프 · 통나무집 인테리어 · 저녁 전용, 점심엔 안 열림" },
    { n:"Allas Sea Pool", c:"휴식", lat:60.167100, lng:24.957162, r:4.2, h:"월~금 6:30~21:00, 토·일 8:00~21:00", m:"바다 사우나+수영장 · 마켓광장 바로 옆" },
    { n:"Hakaniemi Market Hall", c:"식사", lat:60.180098, lng:24.951342, r:4.3, h:"월~토 8:00~18:00, 일 휴무", m:"연어수프 · 현지인 많고 관광지스럽지 않음" },
    { n:"Restaurant BLINIt", c:"식사", lat:60.187901, lng:24.945057, r:4.5, h:"매일 12:00~22:00", m:"블리니·보르시·펠메니 · Kallio 지역" },
    { n:"Saigon Bistro", c:"식사", lat:60.186453, lng:24.951620, r:4.9, h:"평일 11:00~20:00, 금·토 ~22:00", m:"쌀국수 · 평점 높음 · Kallio 지역" },
    { n:"Café Aalto", c:"카페", lat:60.168106, lng:24.943655, r:4.4, h:"평일 9:00~20:00, 토 ~19:00, 일 11-18", m:"Alvar Aalto 설계 서점 2층 · 연어키슈·사과파이" },
    { n:"Old Market Hall", c:"식사", lat:60.166164, lng:24.952819, r:4.5, h:"월~토 8:00~18:00, 일 10-17", m:"1889년 목조 마켓홀 · 연어수프·순록 · Restaurant Story가 이 안에 있음" },
    { n:"Senate Square", c:"관광", lat:60.169479, lng:24.952287, r:4.6, h:"24시간", m:"헬싱키 역사 중심지 · 헬싱키 대성당·국립도서관과 한 광장 · 무료" },
    { n:"National Library of Finland", c:"관광", lat:60.170388, lng:24.950388, r:4.8, h:"화 9:00~18:00, 토·일 휴무", m:"1640년부터 · 화려한 열람실 내부 · 무료" },
    { n:"Havis Amanda", c:"관광", lat:60.167591, lng:24.951404, r:4.4, h:"24시간", m:"헬싱키 상징 인어 분수 · 마켓스퀘어 중앙 · 무료 · 겨울엔 작동 안 할 수 있음" },
    { n:"The Parliament House", c:"관광", lat:60.172608, lng:24.932930, r:4.1, h:"", m:"1931년 완공 · 화강암 외관 · 내부는 목요일 정오 영어 투어만" },
    { n:"Moomin Shop Forum", c:"쇼핑", lat:60.169307, lng:24.938046, r:4.3, h:"매장별 상이, 대체로 매일 10-20", m:"무민 캐릭터 굿즈 · 머그컵·에코백 등 선물용" },
    { n:"S-market Sokos", c:"쇼핑", lat:60.170841, lng:24.939092, r:4.0, h:"24시간", m:"자일리톨 껌·치약, Fazer 초콜릿, 살미아키 민트 등 선물용 구매하기 좋음" },
    { n:"Temppeliaukio 암석교회", c:"관광", lat:60.173025, lng:24.925235, r:4.4, h:"평일 9:00~17:00 (주말 예배로 중단 시간 있음)", m:"암반을 파서 만든 교회 · €8 · 음향 좋아 콘서트 열림" },
    { n:"우스펜스키 성당", c:"관광", lat:60.168602, lng:24.959897, r:4.6, h:"화~금 9:30~16:00, 일 14-16, 월·토 휴무", m:"북유럽 최대 정교회 · 언덕 위라 항구 전망" },
    { n:"건축·디자인 박물관", c:"관광", lat:60.163032, lng:24.946391, r:4.1, h:"화 11:00~20:00, 수~일 11:00~18:00, 월 휴무", m:"숙소 도보 3분 · Aalto·무민 전시" }
  ],
  checklist: [
    { cat:"예약 · 티켓", items:[
      { id:"t1", text:"Flybus 티켓 구매 확정 (9/14 04:00 Bus Stop 12 Höfðatorg 픽업)", note:"예약완료 IF-U9XYWG" },
      { id:"t2", text:"오로라 투어 바우처 재확인 (9/12·9/13 픽업 장소·시간)", note:"9/10분은 악천후 취소 → 9/13으로 재예약" },
      { id:"t3", text:"Jökulsárlón 빙하투어 바우처 재확인 (정확한 픽업 시각)" },
      { id:"t4", text:"항공권 온라인 체크인", note:"출발 24시간 전, ICN/HEL/KEF 각 구간" },
      { id:"t5", text:"여행자보험 가입 확인" },
      { id:"t6", text:"숙소 호스트에게 도착 예정 메시지 발송", note:"레이캬비크·헬싱키 두 곳" }
    ]},
    { cat:"날씨 · 현지정보 (출발 1~2주 전)", items:[
      { id:"w1", text:"vedur.is에서 아이슬란드 날씨 재확인" },
      { id:"w2", text:"오로라 예보(Kp지수) 확인" },
      { id:"w3", text:"fmi.fi에서 헬싱키 날씨 재확인" }
    ]},
    { cat:"짐 챙기기 · 방한", items:[
      { id:"p1", text:"히트텍/기모 이너 상의·하의" },
      { id:"p2", text:"방수·방풍 아우터" },
      { id:"p3", text:"방한장갑, 넥워머, 비니" },
      { id:"p4", text:"핫팩 10개 이상" },
      { id:"p5", text:"두꺼운 울 양말" }
    ]},
    { cat:"짐 챙기기 · 신발/의류", items:[
      { id:"p6", text:"방수 트레킹화", note:"빙하투어 필수" },
      { id:"p7", text:"편한 운동화 (시내용)" },
      { id:"p8", text:"일반 청바지 + 레깅스 (시내 산책용)" }
    ]},
    { cat:"짐 챙기기 · 전자기기", items:[
      { id:"e1", text:"카메라 + 여분 배터리" },
      { id:"e2", text:"미니 삼각대", note:"오로라 촬영용" },
      { id:"e3", text:"보조배터리" },
      { id:"e4", text:"유럽형 멀티어댑터" }
    ]},
    { cat:"짐 챙기기 · 서류/기타", items:[
      { id:"d1", text:"여권 (유효기간 확인)" },
      { id:"d2", text:"각종 예약 바우처 출력본/캡처" },
      { id:"d3", text:"선크림, 립밤, 핸드크림" },
      { id:"d4", text:"상비약" }
    ]},
    { cat:"귀국 당일 (9/16)", items:[
      { id:"o1", text:"헬싱키 숙소 12:00 체크아웃" },
      { id:"o2", text:"HSL 앱에서 공항열차 I·P선 운행 확인", note:"공사 감축 시 600번 버스로 대체" },
      { id:"o3", text:"17:30 출발 · 15:00 전에는 공항 도착" }
    ]},
    { cat:"이동일 (9/14)", items:[
      { id:"m1", text:"숙소 체크아웃 (Flybus 04:00 픽업 전)" },
      { id:"m2", text:"Bus Stop 12 Höfðatorg까지 도보 이동 경로 확인", note:"숙소서 도보 2분" }
    ]}
  ]
};
var DAYS = DATA.days, FOOD = DATA.food, CHECKLIST = DATA.checklist;

var CAT_COLOR  = {"이동":"#4E6E8A","카페":"#9A7635","빵집":"#A8703F","관광":"#2F7566","오로라":"#4B3F91",
                  "쇼핑":"#66727F","간식":"#C25D86","식사":"#D8632F","나이트라이프":"#8A4E32","휴식":"#5A8FA6"};
var FOOD_COLOR = {"카페":"#9A7635","빵집":"#A8703F","간식":"#C25D86","식사":"#D8632F",
                  "관광":"#2F7566","쇼핑":"#66727F","나이트라이프":"#8A4E32","휴식":"#5A8FA6"};
var CAT_ORDER  = ["카페","빵집","간식","식사","관광","쇼핑","나이트라이프","휴식"];

function $(id){ return document.getElementById(id); }
function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function gmaps(lat,lng){
  return "https://www.google.com/maps/dir/?api=1&destination="+lat+","+lng+"&travelmode=walking";
}
/* 장소 이름 → 구글맵 정보 페이지 (영업시간·리뷰·사진) */
function gplace(name, lat, lng){
  var raw = String(name||"");
  /* 출발·도착·체크인 같은 동작 행은 이름 검색이 무의미 → 좌표로 열기 */
  if (/출발|도착|체크인|체크아웃|픽업|복귀|탑승|짐 |짐정리|짐 정리|준비|휴식|보관|장보기/.test(raw)){
    return "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng;
  }
  var q = raw.split("—").pop()
            .replace(/\(.*?\)/g, "")
            .replace(/[⭐⏰⚠️]/g, "").trim();
  if (lat > 64.10 && lat < 64.20 && lng > -22.10 && lng < -21.80) q += " Reykjavík";
  else if (lat > 60.10 && lat < 60.35 && lng > 24.80 && lng < 25.05) q += " Helsinki";
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
}
function dayById(id){ return DAYS.filter(function(d){ return d.id===id; })[0]; }

/* ---------- 접속한 날짜에 맞는 Day 고르기 ---------- */
function localISO(dt){
  var y=dt.getFullYear(), m=dt.getMonth()+1, d=dt.getDate();
  return y + "-" + (m<10?"0":"") + m + "-" + (d<10?"0":"") + d;
}
var TODAY_ISO = localISO(new Date());

function initialDayId(){
  var q = /[?&]day=(\d+)/.exec(location.search);
  if (q){
    var n = parseInt(q[1],10);
    if (dayById(n)) return n;
  }
  var hit = DAYS.filter(function(d){ return d.iso === TODAY_ISO; })[0];
  if (hit) return hit.id;
  if (TODAY_ISO < DAYS[0].iso) return DAYS[0].id;
  if (TODAY_ISO > DAYS[DAYS.length-1].iso) return DAYS[DAYS.length-1].id;
  return DAYS[0].id;
}
function isToday(d){ return d.iso === TODAY_ISO; }

/* ---------- 번호 매기기 ---------- */
function stopLabels(day){
  var out=[], main=0, sub=0;
  day.stops.forEach(function(s){
    if (s.alt){
      sub++;
      out.push(String.fromCharCode(64+sub));   // A, B, C...
    } else {
      main++; sub=0;
      out.push(String(main));
    }
  });
  return out;
}

/* ---------- 연결 상태 ---------- */
function netUpdate(){
  var d = $('netdot');
  if (navigator.onLine){ d.classList.remove('off'); d.title="온라인"; }
  else { d.classList.add('off'); d.title="오프라인 — 저장된 내용으로 보는 중"; }
}
window.addEventListener('online', netUpdate);
window.addEventListener('offline', netUpdate);

/* ---------- 날짜 버튼 ---------- */
function buildDaybar(el, current, onPick){
  el.innerHTML = "";
  DAYS.forEach(function(d){
    var b = document.createElement('button');
    b.type = "button";
    b.className = "dbtn" + (d.id===current ? " on" : "");
    b.setAttribute('role','tab');
    b.setAttribute('aria-selected', d.id===current ? "true":"false");
    b.innerHTML = "Day " + d.id + (isToday(d) ? "<span class='todaydot'>오늘</span>" : "") +
                  "<span class='dd'>" + esc(d.date) + "</span>";
    if (isToday(d)) b.classList.add('today');
    b.addEventListener('click', function(){ onPick(d.id); });
    el.appendChild(b);
  });
}

/* ---------- 일정 행 HTML ---------- */
function stopHTML(s, i, day, label){
  var col = CAT_COLOR[s.cat] || day.color;
  return (s.move ? "<div class='conn'><span class='conn-ic'>➜</span>" + esc(s.move) + "</div>" : "") +
         "<div class='stop" + (s.alt ? " subrow" : "") + "' data-i='" + i + "'>" +
           (s.alt
             ? "<div class='no alt' style='color:" + col + ";border-color:" + col + "'>" + (label || "A") + "</div>"
             : "<div class='no' style='background:" + col + "'>" + (label || (i+1)) + "</div>") +
           "<div class='bd'>" +
             "<div class='tm'>" +
               (s.alt ? "<span class='altlabel sublabel'>대안</span> " : "") +
               esc(s.alt ? s.cat : s.t + " · " + s.cat) +
             "</div>" +
             "<div class='nm'><a class='nmlink' href='" + gplace(s.name,s.lat,s.lng) + "' target='_blank' rel='noopener'>" + esc(s.name) + "</a></div>" +
             (s.note ? "<div class='nt'>" + esc(s.note) + "</div>" : "") +
             "<a class='go' href='" + gmaps(s.lat,s.lng) + "' target='_blank' rel='noopener'>길찾기</a>" +
           "</div></div>";
}

/* ================= 일정 전체 탭 ================= */
var planDay = initialDayId();
function renderPlan(){
  buildDaybar($('daybar'), planDay, function(id){ planDay=id; renderPlan(); });
  var d = dayById(planDay);
  var h = "<div class='dayhead'><h2>Day " + d.id + " · " + esc(d.theme) + "</h2>" +
          "<div class='dt'>" + esc(d.date) + "</div></div>";
  var LB = stopLabels(d);
  d.stops.forEach(function(s,i){ h += stopHTML(s,i,d,LB[i]); });
  $('planBody').innerHTML = h;
}

/* ================= 맛집 탭 (단일 선택 필터) ================= */
var selectedCat = 'all';   /* 'all' 이면 전체 표시, 아니면 그 카테고리만 */

function renderChips(){
  var el = $('chips'); el.innerHTML = "";

  var allBtn = document.createElement('button');
  allBtn.type = "button";
  allBtn.className = "chip" + (selectedCat==='all' ? " on" : "");
  if (selectedCat==='all') allBtn.style.background = "#173355";
  allBtn.textContent = "전체 " + FOOD.length;
  allBtn.addEventListener('click', function(){
    selectedCat = 'all';
    renderChips(); renderFoodList();
    if (foodOn) drawFood();
  });
  el.appendChild(allBtn);

  CAT_ORDER.forEach(function(cat){
    var n = FOOD.filter(function(f){ return f.c===cat; }).length;
    if(!n) return;
    var b = document.createElement('button');
    b.type="button";
    var on = selectedCat === cat;
    b.className = "chip" + (on ? " on" : "");
    if(on) b.style.background = FOOD_COLOR[cat];
    b.textContent = cat + " " + n;
    b.addEventListener('click', function(){
      /* 같은 걸 다시 누르면 전체로 복귀, 아니면 그 카테고리만 단독 표시 */
      selectedCat = (selectedCat === cat) ? 'all' : cat;
      renderChips();
      renderFoodList();
      if (foodOn) drawFood();
    });
    el.appendChild(b);
  });
}

function renderFoodList(){
  var list = selectedCat === 'all' ? FOOD : FOOD.filter(function(f){ return f.c === selectedCat; });
  if(!list.length){ $('foodBody').innerHTML = "<div class='empty'>해당 분류가 없어요.</div>"; return; }
  var h = "";
  list.forEach(function(f){
    var col = FOOD_COLOR[f.c] || "#666";
    h += "<div class='fcard'><div class='r1'>" +
           "<span class='cat' style='background:" + col + "'>" + esc(f.c) + "</span>" +
           "<a class='nm nmlink' href='" + gplace(f.n,f.lat,f.lng) + "' target='_blank' rel='noopener'>" + esc(f.n) + "</a>" +
           (f.r ? "<span class='rt'>★ " + f.r + "</span>" : "") +
         "</div>" +
         (f.h ? "<div class='hr'>🕘 " + esc(f.h) + "</div>" : "") +
         (f.m ? "<div class='mm'>" + esc(f.m) + "</div>" : "") +
         "<a class='go' href='" + gmaps(f.lat,f.lng) + "' target='_blank' rel='noopener'>길찾기</a>" +
         "</div>";
  });
  $('foodBody').innerHTML = h;
}

/* ================= 체크리스트 탭 ================= */
var CHECK_KEY = 'if26_checklist_v1';
function loadCheckState(){
  try { return JSON.parse(localStorage.getItem(CHECK_KEY) || "{}"); }
  catch(e){ return {}; }
}
function saveCheckState(st){
  try { localStorage.setItem(CHECK_KEY, JSON.stringify(st)); } catch(e){}
}
var checkState = loadCheckState();

function checklistCounts(){
  var total=0, done=0;
  CHECKLIST.forEach(function(g){
    g.items.forEach(function(it){
      total++;
      if (checkState[it.id]) done++;
    });
  });
  return {total:total, done:done};
}

function renderChecklist(){
  var h = "";
  CHECKLIST.forEach(function(g){
    h += "<div class='ckcat'>" + esc(g.cat) + "</div>";
    g.items.forEach(function(it){
      var on = !!checkState[it.id];
      h += "<div class='ckitem" + (on?" on":"") + "' data-id='" + it.id + "'>" +
             "<div class='ckbox" + (on?" on":"") + "'>" + (on?"✓":"") + "</div>" +
             "<div class='ckbd'>" +
               "<div class='cktext'>" + esc(it.text) + "</div>" +
               (it.note ? "<div class='cknote'>" + esc(it.note) + "</div>" : "") +
             "</div>" +
           "</div>";
    });
  });
  $('checkBody').innerHTML = h;
  Array.prototype.forEach.call($('checkBody').querySelectorAll('.ckitem'), function(row){
    row.addEventListener('click', function(){
      var id = row.dataset.id;
      checkState[id] = !checkState[id];
      saveCheckState(checkState);
      renderChecklist();
      updateCheckProg();
    });
  });
}

function updateCheckProg(){
  var c = checklistCounts();
  $('checkProg').textContent = c.done + " / " + c.total + " 완료";
}

$('btnCheckReset').addEventListener('click', function(){
  if (!confirm("체크리스트를 전체 초기화할까요?")) return;
  checkState = {};
  saveCheckState(checkState);
  renderChecklist();
  updateCheckProg();
});

/* ================= 지도 + 시트 ================= */
var map=null, tiles=null, dayLayer=null, foodLayer=null, meMarker=null, canvasRenderer=null;
var mapDay=initialDayId(), foodOn=false, mapReady=false, dayMarkers=[], selected=-1;
var TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

function sheetPeekPx(){
  var v = getComputedStyle(document.documentElement).getPropertyValue('--peek');
  return parseInt(v,10) || 238;
}

function initMap(){
  if (mapReady){ setTimeout(function(){ map.invalidateSize(); }, 60); return; }

  map = L.map('map', { zoomControl:false, preferCanvas:true, tap:true })
         .setView([64.14,-21.93], 12);   /* 기본: 레이캬비크 */
  tiles = L.tileLayer(TILE_URL, {
    maxZoom:18, minZoom:4, crossOrigin:true, attribution:'&copy; OpenStreetMap'
  }).addTo(map);

  canvasRenderer = L.canvas({ padding:0.4 });
  dayLayer  = L.layerGroup().addTo(map);
  foodLayer = L.layerGroup();

  rebuildMapDaybar();
  mapReady = true;
  drawDay(true);
  setTimeout(function(){ map.invalidateSize(); }, 80);
}

function rebuildMapDaybar(){
  buildDaybar($('mapDaybar'), mapDay, function(id){
    mapDay = id; selected = -1;
    rebuildMapDaybar(); drawDay(true);
  });
}

function drawDay(fit){
  if(!mapReady) return;
  dayLayer.clearLayers();
  dayMarkers = [];
  var d = dayById(mapDay);
  var LB = stopLabels(d);

  var mainPts = d.stops.filter(function(s){ return !s.alt; })
                       .map(function(s){ return [s.lat,s.lng]; });
  if (mainPts.length > 1){
    L.polyline(mainPts, {color:d.color, weight:4, opacity:.85, dashArray:"1,9", lineCap:"round"})
     .addTo(dayLayer);
  }

  d.stops.forEach(function(s,i){
    var col = CAT_COLOR[s.cat] || d.color;
    var pinHTML = s.alt
      ? "<div class='num-pin alt' style='color:"+col+";border-color:"+col+"'><span>"+LB[i]+"</span></div>"
      : "<div class='num-pin' style='background:"+d.color+"'><span>"+LB[i]+"</span></div>";

    var m = L.marker([s.lat,s.lng], {
      icon: L.divIcon({ className:"", html:pinHTML,
        iconSize:[30,30], iconAnchor:[15,28], popupAnchor:[0,-26] })
    }).bindPopup(
      "<div class='pp-c' style='color:"+col+"'>"+(s.alt ? "대안 · " : esc(s.t)+" · ")+esc(s.cat)+"</div>"+
      "<div class='pp-n'><a class='nmlink' href='"+gplace(s.name,s.lat,s.lng)+"' target='_blank' rel='noopener'>"+LB[i]+". "+esc(s.name)+"</a></div>"+
      (s.note ? "<div class='pp-t'>"+esc(s.note)+"</div>" : "")+
      "<a class='pp-l' href='"+gmaps(s.lat,s.lng)+"' target='_blank' rel='noopener'>📍 길찾기</a>"
    ).addTo(dayLayer);
    m.on('click', function(){ selectStop(i, false); });
    dayMarkers.push(m);
  });

  renderSheetList(d);
  if (fit) fitDay();
}

function fitDay(){
  var d = dayById(mapDay);
  var pts = d.stops.filter(function(s){ return !s.alt; })
                   .map(function(s){ return [s.lat,s.lng]; });
  if (!pts.length) pts = d.stops.map(function(s){ return [s.lat,s.lng]; });
  var pad = $('sheet').classList.contains('open')
            ? Math.round(window.innerHeight * 0.72)
            : sheetPeekPx();
  if (pts.length === 1){
    map.setView(pts[0], 12);
    return;
  }
  map.fitBounds(L.latLngBounds(pts), {
    paddingTopLeft:[24, 62],
    paddingBottomRight:[24, pad + 16]
  });
}

function renderSheetList(d){
  var h = "";
  var LB = stopLabels(d);
  d.stops.forEach(function(s,i){ h += stopHTML(s,i,d,LB[i]); });
  var el = $('stopList');
  el.innerHTML = h;
  Array.prototype.forEach.call(el.querySelectorAll('.stop'), function(row){
    row.addEventListener('click', function(e){
      if (e.target && (e.target.classList.contains('go') || e.target.classList.contains('nmlink'))) return;
      selectStop(parseInt(row.dataset.i,10), true);
    });
  });
}

function selectStop(i, fromList){
  selected = i;
  var d = dayById(mapDay), s = d.stops[i];

  Array.prototype.forEach.call($('stopList').querySelectorAll('.stop'), function(r){
    r.classList.toggle('sel', parseInt(r.dataset.i,10) === i);
  });

  if (fromList){
    var off = $('sheet').classList.contains('open') ? 0 : 0.28;
    map.setView([s.lat + off * 0.004, s.lng], Math.max(map.getZoom(), 13), {animate:true});
    if (dayMarkers[i]) dayMarkers[i].openPopup();
  } else {
    var row = $('stopList').querySelector(".stop[data-i='"+i+"']");
    if (row) row.scrollIntoView({block:'nearest', behavior:'smooth'});
  }
}

function drawFood(){
  foodLayer.clearLayers();
  FOOD.forEach(function(f){
    if (selectedCat !== 'all' && f.c !== selectedCat) return;
    var col = FOOD_COLOR[f.c] || "#666";
    L.circleMarker([f.lat,f.lng], {
      renderer:canvasRenderer, radius:7, weight:2,
      color:"#fff", fillColor:col, fillOpacity:1
    }).bindPopup(
      "<div class='pp-c' style='color:"+col+"'>"+esc(f.c)+(f.r?" · ★"+f.r:"")+"</div>"+
      "<div class='pp-n'><a class='nmlink' href='"+gplace(f.n,f.lat,f.lng)+"' target='_blank' rel='noopener'>"+esc(f.n)+"</a></div>"+
      (f.h ? "<div class='pp-t'>🕘 "+esc(f.h)+"</div>" : "")+
      (f.m ? "<div class='pp-t'>"+esc(f.m)+"</div>" : "")+
      "<a class='pp-l' href='"+gmaps(f.lat,f.lng)+"' target='_blank' rel='noopener'>📍 길찾기</a>"
    ).addTo(foodLayer);
  });
}

/* ---------- 시트 열고 닫기 ---------- */
var sheet, grip;
function setSheet(open){
  sheet.classList.toggle('open', open);
  grip.setAttribute('aria-expanded', open ? "true" : "false");
  $('gripText').textContent = open ? "아래로 내리면 지도 넓게" : "위로 올리면 전체 일정";
  $('view-map').classList.toggle('sheetopen', open);
  setTimeout(function(){ if(map) map.invalidateSize(); }, 240);
}

function initSheet(){
  sheet = $('sheet'); grip = $('grip');
  grip.addEventListener('click', function(){
    setSheet(!sheet.classList.contains('open'));
  });

  var y0 = null;
  function start(e){ y0 = (e.touches ? e.touches[0].clientY : e.clientY); }
  function end(e){
    if (y0 === null) return;
    var y1 = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY);
    var dy = y1 - y0;
    y0 = null;
    if (Math.abs(dy) < 24) return;
    setSheet(dy < 0);
  }
  grip.addEventListener('touchstart', start, {passive:true});
  grip.addEventListener('touchend', end, {passive:true});
  grip.addEventListener('mousedown', start);
  grip.addEventListener('mouseup', end);
}

/* ---------- 지도 타일 미리 저장 (구역별 줌 다르게: 시내는 세밀, 남부해안 장거리 구간은 낮은 줌) ---------- */
function lon2x(lon,z){ return Math.floor((lon+180)/360*Math.pow(2,z)); }
function lat2y(lat,z){
  var r = lat*Math.PI/180;
  return Math.floor((1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*Math.pow(2,z));
}
function tileListForBounds(b, zooms){
  var out=[];
  zooms.forEach(function(z){
    var x1=lon2x(b[1],z), x2=lon2x(b[3],z), y1=lat2y(b[2],z), y2=lat2y(b[0],z);
    for(var x=Math.min(x1,x2); x<=Math.max(x1,x2); x++)
      for(var y=Math.min(y1,y2); y<=Math.max(y1,y2); y++)
        out.push(TILE_URL.replace("{z}",z).replace("{x}",x).replace("{y}",y));
  });
  return out;
}
/* b = [북쪽위도, 서쪽경도, 남쪽위도, 동쪽경도] */
var SAVE_AREAS = [
  { name:"레이캬비크 시내",                              b:[64.1600,-21.9600, 64.1350,-21.9000], z:[13,14,15,16] },
  { name:"레이캬비크 광역 (Seltjarnarnes~Ásmundarsafn)", b:[64.1750,-22.0400, 64.1250,-21.8700], z:[12,13,14] },
  { name:"남부해안 (Seljalandsfoss~Jökulsárlón)",        b:[64.2000,-20.1000, 63.4000,-16.0000], z:[9,10,11] },
  { name:"헬싱키 시내",                                  b:[60.1900, 24.9000, 60.1550, 24.9700], z:[13,14,15,16] }
];
var SAVE_CAP=1600;
function uniq(a){ var s={}; return a.filter(function(v){ if(s[v]) return false; s[v]=1; return true; }); }

function prefetchTiles(){
  var btn=$('btnSave'), note=$('saveNote'), bar=$('saveBar'), fill=$('saveFill');
  if(!navigator.onLine){ note.textContent = "인터넷에 연결된 상태에서 눌러주세요."; return; }

  var urls=[];
  SAVE_AREAS.forEach(function(a){ urls = urls.concat(tileListForBounds(a.b, a.z)); });
  urls = uniq(urls).slice(0, SAVE_CAP);

  btn.disabled = true; bar.hidden = false;
  var done=0, fail=0, i=0, CONC=4;
  function step(){
    if(i >= urls.length) return Promise.resolve();
    var url = urls[i++];
    return fetch(url, {mode:'cors', cache:'force-cache'})
      .catch(function(){ fail++; })
      .then(function(){
        done++;
        fill.style.width = Math.round(done/urls.length*100) + "%";
        note.textContent = "저장 중… " + done + " / " + urls.length;
        return new Promise(function(r){ setTimeout(r,30); }).then(step);
      });
  }
  var ws=[]; for(var w=0; w<CONC; w++) ws.push(step());
  Promise.all(ws).then(function(){
    btn.disabled = false;
    note.textContent = fail > urls.length/3
      ? "일부만 저장됐어요. 신호가 좋은 곳에서 한 번 더 눌러주세요."
      : "저장 완료. 레이캬비크·남부해안·헬싱키 지도가 오프라인에서도 보여요.";
    setTimeout(function(){ bar.hidden = true; fill.style.width = "0"; }, 2500);
  });
}

/* ================= 화면 전환 ================= */
var VIEWS = { map:'view-map', plan:'view-plan', food:'view-food', check:'view-check' };
function show(v){
  Object.keys(VIEWS).forEach(function(k){ $(VIEWS[k]).hidden = (k !== v); });
  Array.prototype.forEach.call(document.querySelectorAll('.tab'), function(t){
    var on = t.dataset.v === v;
    t.classList.toggle('on', on);
    t.setAttribute('aria-selected', on ? "true" : "false");
  });
  if (v === 'map') initMap();
}
Array.prototype.forEach.call(document.querySelectorAll('.tab'), function(t){
  t.addEventListener('click', function(){ show(t.dataset.v); });
});

$('btnFit').addEventListener('click', function(){ fitDay(); });

$('btnFood').addEventListener('click', function(){
  foodOn = !foodOn;
  this.setAttribute('aria-pressed', foodOn ? "true":"false");
  if (foodOn){ foodLayer.addTo(map); drawFood(); } else { map.removeLayer(foodLayer); }
});

$('btnLoc').addEventListener('click', function(){
  if(!navigator.geolocation){ alert("이 기기에서는 위치를 쓸 수 없어요."); return; }
  var b = this; b.textContent = "…";
  navigator.geolocation.getCurrentPosition(function(p){
    b.textContent = "📍";
    if(meMarker) map.removeLayer(meMarker);
    meMarker = L.marker([p.coords.latitude,p.coords.longitude], {
      icon: L.divIcon({className:"", html:"<div class='me-dot'></div>",
                       iconSize:[18,18], iconAnchor:[9,9]})
    }).addTo(map);
    map.setView([p.coords.latitude,p.coords.longitude], 15);
  }, function(){
    b.textContent = "📍";
    alert("위치를 가져오지 못했어요. 설정에서 위치 권한과 GPS를 확인해주세요.");
  }, {enableHighAccuracy:true, timeout:10000, maximumAge:60000});
});

$('btnSave').addEventListener('click', prefetchTiles);

/* 최신 내용으로 새로고침 — 앱 파일 캐시를 비우고 다시 받아옴 */
$('btnReload').addEventListener('click', function(){
  var b = this;
  b.classList.add('spin');
  if (!navigator.onLine){
    b.classList.remove('spin');
    alert("인터넷에 연결된 상태에서 눌러주세요.");
    return;
  }
  var jobs = [];
  if (window.caches){
    jobs.push(caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        /* 지도 타일 캐시는 그대로 두고 앱 파일 캐시만 삭제 */
        if (k.indexOf('tiles') === -1) return caches.delete(k);
      }));
    }));
  }
  if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations){
    jobs.push(navigator.serviceWorker.getRegistrations().then(function(rs){
      return Promise.all(rs.map(function(r){ return r.update(); }));
    }));
  }
  Promise.all(jobs).catch(function(){}).then(function(){
    location.reload(true);
  });
});

window.addEventListener('resize', function(){
  if (map) setTimeout(function(){ map.invalidateSize(); }, 120);
});

/* ================= 시작 ================= */
netUpdate();
initSheet();
renderPlan();
renderChips();
renderFoodList();
renderChecklist();
updateCheckProg();
show('map');

})();
