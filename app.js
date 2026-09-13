/* 아이슬란드·핀란드 여행 — 앱 로직
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
      { t:"15:00", name:"숙소 체크인 (Bríetartún 18)", lat:64.1437875, lng:-21.9126406, cat:"이동", note:"Luggage Lockers에서 짐 찾아서 이동" },
      { t:"16:00", name:"Sundhöll Reykjavíkur — 수영장·온탕·사우나", lat:64.141829, lng:-21.920652, cat:"휴식", note:"목요일 15:00~22:00 · Hallgrímskirkja와 같은 건축가(Guðjón Samúelsson) 작품 · 성인 1,380 ISK · 수영복 대여 가능 · 탕 들어가기 전 알몸 샤워는 필수(성별 분리)" },
      { t:"19:30", name:"숙소에서 휴식 (오로라 투어 취소됨)", lat:64.1437875, lng:-21.9126406, cat:"이동", note:"악천후로 취소 · 무료 재예약 진행 → Day4로 이동" },
      { alt:true, t:"", name:"Café Loki", lat:64.142403, lng:-21.928852, cat:"식사", note:"쉬지 않았다면 · Lokastígur 28, 도보 5분, ~22시 · 램수프·호밀빵 아이스크림" },
      { alt:true, t:"", name:"Skúli Craft Bar", lat:64.147554, lng:-21.941615, cat:"나이트라이프", note:"쉬지 않았다면 · Aðalstræti 9, ~23시 · 아이슬란드 크래프트 맥주" }
    ]},
    { id:2, color:"#2A6F8E", theme:"빙하투어 (남부해안)", date:"9/11 (금)", iso:"2026-09-11", stops:[
      { t:"07:00", name:"투어 출발 (숙소 인근 픽업)", lat:64.1437875, lng:-21.9126406, cat:"이동", note:"정확한 픽업시간은 바우처로 재확인" },
      { t:"08:45", name:"흐볼스뵐루르 — 휴식 15분", lat:63.751113, lng:-20.222920, cat:"이동", note:"버스·코치 105분 이동 후 휴게" },
      { t:"09:20~09:50", name:"Seljalandsfoss — 사진촬영 30분", lat:63.615623, lng:-19.988569, cat:"관광", note:"실제 방문 시간 · 폭포 뒤로 걸어들어갈 수 있음 · 우비 필요" },
      { t:"11:30~12:00", name:"키르큐베야르클라우스트르 — Stjórnarfoss 구경 & 점심", lat:63.789024, lng:-18.053116, cat:"식사", note:"Stjórnarfoss(주차장에서 도보 5분 이내) 구경 겸 점심" },
      { t:"13:30~15:00", name:"Jökulsárlón 빙하라군 & Diamond Beach", lat:64.078446, lng:-16.230554, cat:"관광", note:"실제 방문 시간 · 유빙·물범 관찰 · 보트크루즈 옵션(추가요금)" },
      { t:"15:55~16:05", name:"Skeiðará Bridge Monument", lat:63.984627, lng:-16.959378, cat:"관광", note:"돌아오는 길에 방문 · 1996년 빙하 홍수로 휘어진 다리 잔해, 짧은 포토스톱" },
      { t:"17:40~18:15", name:"비크이뮈르달 — 저녁", lat:63.417650, lng:-18.997440, cat:"식사", note:"18:15 실제 출발 확인됨 · 도착시간은 추정" },
      { t:"20:30", name:"투어 종료, Bus Stop 12 Höfðatorg 하차", lat:64.1443797, lng:-21.9104986, cat:"이동", note:"실제 도착 시간 · 숙소까지 도보 2분" }
    ]},
    { id:3, color:"#4B3F91", theme:"자유시간 · 오로라#2", date:"9/12 (토)", iso:"2026-09-12", stops:[
      { t:"13:20", name:"Reykjavík Art Museum — Hafnarhús", lat:64.149139, lng:-21.940938, cat:"관광", move:"⭐Kjarvalsstaðir에서 시티 카드 수령 (숙소서 도보 9분) → 🚌 버스로 이동 (카드로 무료)", note:"24시간권이면 내일 13:00쯤까지 · 입장료 2,550 ISK 카드로 무료 · 매일 10-17(목~22) · Erró 상설전" },
      { t:"14:30", name:"Kolaportið 벼룩시장", lat:64.148933, lng:-21.938775, cat:"쇼핑", move:"바로 옆 건물, 도보 1분", note:"토·일 11:00~17:00만 운영 · 입장 무료" },
      { t:"15:30", name:"늦은 점심 — Old Harbour HOT DOGS", lat:64.151190, lng:-21.944257, cat:"간식", move:"도보 6분 (10분 미만이라 걸어감)", note:"매일 11:00~20:00 · Bæjarins Beztu보다 한적하고 대기 적음" },
      { t:"16:15", name:"Marshall House — Kling & Bang · Living Art Museum(Nýlistasafnið)", lat:64.156255, lng:-21.939150, cat:"관광", move:"도보 12분 → 🚌 버스 이용 (시티카드 무료)", note:"토요일 12:00~18:00 · 입장 무료(3개 갤러리 모두) · 마감 18시니 여유 확인" },
      { t:"17:45", name:"숙소 복귀, 저녁은 집에서", lat:64.1437875, lng:-21.9126406, cat:"이동", move:"도보 35분 → 🚌 버스 이용 (시티카드 무료)", note:"컨디션 안 좋아 술은 패스 · 푹 쉬고 투어 준비" },
      { t:"21:00~02:00", name:"오로라 투어 #2", lat:64.1437875, lng:-21.9126406, cat:"오로라", note:"Northern Lights Guided Tour · 픽업 장소 바우처 확인" }
    ]},
    { id:4, color:"#26617F", theme:"자유시간 · 오로라 재도전", date:"9/13 (일)", iso:"2026-09-13", stops:[
      { t:"10:00", name:"National Museum of Iceland", lat:64.141615, lng:-21.948578, cat:"관광", move:"아침은 집에서 · 숙소에서 도보 28분 → 🚌 버스 (시티카드 무료, 유효시간 내)", note:"⏰카드 만료(13:20) 전에 먼 곳부터 · 입장료 약 2,500 ISK 커버 · 1~1.5시간 소요" },
      { t:"11:30", name:"국립미술관 (National Gallery)", lat:64.144157, lng:-21.938863, cat:"관광", move:"도보 8분", note:"입장료 약 1,700 ISK 커버 · 매일 10-17" },
      { t:"12:30", name:"The Settlement Exhibition (정착 전시관)", lat:64.147399, lng:-21.942501, cat:"관광", move:"도보 6분", note:"⏰카드 만료 직전 입장 · 입장료 약 2,500 ISK 커버 · 1000년 전 롱하우스 발굴 유적" },
      { t:"14:15", name:"Reykjavík Roasters 커피", lat:64.1436111, lng:-21.9266667, cat:"카페", move:"도보 16분 (여기부터는 카드 만료 → 전부 도보)", note:"매일 7:00~17:00 · 자가배전" },
      { t:"14:45", name:"Braud & Co에서 빵 구매 (내일 비행기용)", lat:64.1440791, lng:-21.9259781, cat:"빵집", move:"도보 3분, 바로 옆", note:"매일 6:30~17:00 · 대안: Sandholt(도보 3분, ~18:00) / BakaBaka(~22:00)" },
      { t:"15:15", name:"숙소 복귀 · 휴식", lat:64.1437875, lng:-21.9126406, cat:"이동", move:"도보 12분" },
      { t:"19:00", name:"숙소에서 저녁", lat:64.1437875, lng:-21.9126406, cat:"식사", note:"SPAR에서 산 재료로 간단히" },
      { t:"20:30", name:"짐 챙기기", lat:64.1437875, lng:-21.9126406, cat:"이동", note:"투어 끝나고 바로 04:00 Flybus라 지금 다 싸두기" },
      { t:"21:30~약02:00", name:"오로라 투어 (Day1 취소분 재예약)", lat:64.1437875, lng:-21.9126406, cat:"오로라", note:"⚠️ 투어 종료~04:00 Flybus 픽업까지 휴식시간이 약 2시간뿐" },
      { t:"04:00(+1)", name:"Flybus 픽업 (다음날 새벽)", lat:64.1443797, lng:-21.9104986, cat:"이동", note:"바로 이어지는 일정이니 투어 중에도 시간 체크" }
    ]},
    { id:5, color:"#7A4E97", theme:"아이슬란드 → 헬싱키", date:"9/14 (월)", iso:"2026-09-14", stops:[
      { t:"04:00", name:"Flybus 숙소 픽업 (Bus Stop 12 Höfðatorg)", lat:64.1443797, lng:-21.9104986, cat:"이동", note:"픽업 시작 04:00 · 출발 04:30 (예약 확정 IF-U9XYWG)" },
      { t:"04:45", name:"케플라비크(KEF) 공항 도착", lat:63.981487, lng:-22.628186, cat:"이동", note:"45분 소요 · 08:35 출발까지 여유 있음" },
      { t:"08:35", name:"KEF 출발 (AY0992)", lat:63.981487, lng:-22.628186, cat:"이동" },
      { t:"15:00", name:"헬싱키(HEL) 도착", lat:60.317945, lng:24.949624, cat:"이동", note:"Schengen 역내 이동, 입국심사 없음" },
      { t:"16:00", name:"숙소 체크인 (Korkeavuorenkatu 3)", lat:60.160012, lng:24.947378, cat:"이동" },
      { t:"17:00", name:"Kauppatori 마켓광장 · 항구 산책", lat:60.167665, lng:24.953678, cat:"관광", note:"매일 · 장거리 이동 뒤 가볍게 산책, 수산물·기념품 좌판 구경 · 바로 옆 Allas Sea Pool(수영복 대여 가능, 월~금 6:30~21:00)도 있음" },
      { t:"19:00", name:"저녁 — Kappeli", lat:60.167386, lng:24.950323, cat:"식사", note:"1867년부터 · 온실 건물 · 엘크스테이크" }
    ]},
    { id:6, color:"#1F5AA8", theme:"헬싱키", date:"9/15 (화)", iso:"2026-09-15", stops:[
      { t:"10:00", name:"Oodi 도서관", lat:60.173683, lng:24.937919, cat:"관광", note:"월~금 8:00~21:00, 토·일 10:00~20:00 · 무료 입장" },
      { t:"13:00", name:"Kiasma 컨템포러리 아트뮤지엄", lat:60.171591, lng:24.936864, cat:"관광", note:"화요일 10:00~20:00 · 월요일 휴관" },
      { t:"15:00", name:"Design District 쇼핑", lat:60.160609, lng:24.946688, cat:"쇼핑" },
      { t:"17:00", name:"Kallio 지역 산책", lat:60.184324, lng:24.949357, cat:"관광", note:"언덕 위 랜드마크 교회 · 헬싱키 전망" },
      { t:"19:00", name:"저녁 — Restaurant Story", lat:60.166169, lng:24.952838, cat:"식사", note:"매일 8:00~17:00 · 미트볼·순록 요리" }
    ]},
    { id:7, color:"#4E6E8A", theme:"헬싱키 → 한국", date:"9/16 (수)", iso:"2026-09-16", stops:[
      { t:"12:00", name:"숙소 체크아웃", lat:60.160012, lng:24.947378, cat:"이동" },
      { t:"12:15", name:"점심 — Fazer Café", lat:60.168647, lng:24.947674, cat:"식사", note:"역 가는 길 · 도보 15분 내외" },
      { t:"13:30", name:"헬싱키 중앙역 도착", lat:60.171873, lng:24.941422, cat:"이동" },
      { t:"13:40", name:"공항행 열차(Ring Rail) 탑승", lat:60.171873, lng:24.941422, cat:"이동", note:"약 30분 소요" },
      { t:"14:10", name:"헬싱키 공항(HEL) 도착", lat:60.317945, lng:24.949624, cat:"이동", note:"17:30 출발까지 약 3시간20분 여유 (2시간반 목표 충족)" },
      { t:"17:30", name:"HEL 출발 (AY0041)", lat:60.317945, lng:24.949624, cat:"이동" }
    ]},
    { id:8, color:"#7A4E97", theme:"한국 도착", date:"9/17 (목)", iso:"2026-09-17", stops:[
      { t:"11:20", name:"인천(ICN) 도착", lat:37.4602, lng:126.4407, cat:"이동" }
    ]}
  ],
  food: [
    { n:"Reykjavík Roasters", c:"카페", lat:64.1436111, lng:-21.9266667, r:4.6, h:"매일 7:00~17:00", m:"자가배전 · 시내 중심" },
    { n:"Braud & Co", c:"빵집", lat:64.1440791, lng:-21.9259781, r:4.8, h:"매일 6:30~17:00", m:"시나몬번 유명 · 좌석 적음" },
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
    { n:"Reykjavík Art Museum (Kjarvalsstaðir)", c:"관광", lat:64.137915, lng:-21.913477, r:4.4, h:"매일 10:00~17:00", m:"Klambratún 공원 안 · Kjarval 상설전 · 입장료 2,550 ISK(3개 지점 공통) · 시티카드 수령처 · 카페 평 좋음" },
    { n:"The Settlement Exhibition", c:"관광", lat:64.147399, lng:-21.942501, r:4.5, h:"매일 10:00~17:00", m:"1000년 전 롱하우스 발굴 유적 · 입장료 약 2,500 ISK · 시티카드 커버 및 수령처" },
    { n:"Old Harbour HOT DOGS", c:"간식", lat:64.151190, lng:-21.944257, r:4.7, h:"매일 11:00~20:00", m:"Bæjarins Beztu보다 한적함 · 항구 끝자락 위치" },
    { n:"Saga Museum", c:"관광", lat:64.152547, lng:-21.951344, r:4.3, h:"매일 10:00~17:00", m:"바이킹 역사 체험형 · 오디오가이드 · 코스튬 촬영 가능" },
    { n:"Hallgrímskirkja", c:"관광", lat:64.1420229, lng:-21.9265494, r:4.6, h:"매일 10:00~17:00", m:"전망대 유료 · 랜드마크" },
    { n:"Harpa", c:"관광", lat:64.1502464, lng:-21.9322805, r:4.6, h:"매일 10:00~18/20:00", m:"건축·공연장 · 무료 관람 가능" },
    { n:"Mokka Kaffi", c:"카페", lat:64.146003, lng:-21.932405, r:4.5, h:"매일 9:00~18:00", m:"1958년 · 레이캬비크 최고(最古) 카페 · 와플 유명" },
    { n:"Planta Kaffihús", c:"카페", lat:64.142538, lng:-21.920516, r:4.8, h:"화~일 8:00~17:00 (월 휴무)", m:"비건 카페 · 치즈번·수프 좋음" },
    { n:"The World of Icelandic Music", c:"관광", lat:64.149909, lng:-21.932813, r:5.0, h:"매일 10:00~20:00", m:"아이슬란드 음악사 인터랙티브 전시 · Harpa 근처" },
    { n:"Bernhöftsbakarí", c:"빵집", lat:64.147926, lng:-21.926752, r:4.7, h:"평일 7:30~17:00, 주말 8:00~16:00", m:"레이캬비크에서 가장 오래된 베이커리 · 도넛·치즈번" },
    { n:"Vínbúðin (Austurstræti)", c:"쇼핑", lat:64.147678, lng:-21.939615, r:4.3, h:"월~토 11:00~18/19:00, 일요일 휴무", m:"국영 주류 전문점 · 아이슬란드는 여기서만 맥주·와인·양주 구매 가능" },
    { n:"Stjórnarfoss", c:"관광", lat:63.799752, lng:-18.061301, r:4.7, h:"", m:"키르큐베야르클라우스트르 주차장에서 도보 5분 · 사람 적고 조용한 폭포" },
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
    { n:"Allas Sea Pool", c:"휴식", lat:60.167100, lng:24.957162, r:4.2, h:"월~금 6:30~21:00, 토·일 8:00~21:00", m:"바다 사우나+수영장 · 마켓광장 바로 옆" }
  ],
  checklist: [
    { cat:"예약 · 티켓", items:[
      { id:"t1", text:"Flybus 티켓 구매 확정 (9/14 04:00 Bus Stop 12 Höfðatorg 픽업)", note:"예약완료 IF-U9XYWG" },
      { id:"t2", text:"오로라 투어 2회 바우처 재확인 (9/10·9/12 픽업 장소·시간)" },
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
    { cat:"출발 당일 (9/9)", items:[
      { id:"o1", text:"인천공항 수속 마감시간 확인", note:"21:50 출발, 2시간 전 도착 권장" },
      { id:"o2", text:"유심/로밍 준비" },
      { id:"o3", text:"짐 최종 무게 확인" }
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
             "<div class='nm'>" + esc(s.name) + "</div>" +
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
           "<span class='nm'>" + esc(f.n) + "</span>" +
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
      "<div class='pp-n'>"+LB[i]+". "+esc(s.name)+"</div>"+
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
      if (e.target && e.target.classList.contains('go')) return;
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
      "<div class='pp-n'>"+esc(f.n)+"</div>"+
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
  { name:"레이캬비크 시내",              b:[64.1650,-21.9700, 64.1300,-21.9000], z:[13,14,15,16] },
  { name:"남부해안 (스코가포스~요쿨살론)", b:[64.2000,-20.1000, 63.4000,-16.0000], z:[9,10,11] },
  { name:"헬싱키 시내",                  b:[60.1900, 24.9000, 60.1550, 24.9700], z:[13,14,15,16] }
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
