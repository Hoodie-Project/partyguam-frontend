'use client';

import React from 'react';

import { PolicyLayout, SContainer, SemiTItle, SMargin, Text } from '@/styles/components';

import PolicyNav from './PolicyNav';

function PolicyPrivacy() {
  return (
    <SContainer>
      <PolicyLayout>
        <PolicyNav />
        <Text>
          ‘파티구함’(이하 &ldquo;회사&ldquo; 또는 &ldquo;사이트&ldquo;)은 정보주체의 자유와 권리 보호를 위해 「개인정보
          보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하기 위해 최선을 다하고
          있습니다.
          <br />
          이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한
          고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리 방침을 수립·공개합니다.
        </Text>
        <SMargin margin="60px 0px 0px 0px" />

        <SemiTItle>제1조(개인정보의 수집 및 이용목적)</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          회사는 다음 목적을 위하여 개인정보를 수집하고 있으며 다음 목적 이외의 용도로는 수집한 개인정보를 이용하지
          않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를
          이행할 예정입니다.
        </Text>
        <SMargin margin="20px 0px 0px 0px" />
        <Text style={{ fontWeight: 'bold' }}>1) 회원관리</Text>
        <br />
        <Text>
          회원제 서비스 이용에 따른 본인확인, 본인의 의사 확인, 고객 문의에 대한 응답, 새로운 정보의 소개 및 고지사항
          전달
          <br />
        </Text>
        <Text style={{ fontWeight: 'bold' }}>2) 서비스 개발 및 마케팅ㆍ광고 활용</Text>
        <br />
        <Text>
          맞춤 서비스 제공, 서비스 안내 및 이용 권유, 서비스 개선 및 신규 서비스 개발을 위한 통계 및 접속 빈도 파악,
          통계학적 특성에 따른 광고, 이벤트 정보 및 참여 기회 제공
          <br />
        </Text>
        <Text style={{ fontWeight: 'bold' }}>
          3) 고용 및 취업 동향 파악을 위한 통계학적 분석, 서비스 고도화를 위한 데이터 분석
        </Text>
        <br />
        <Text>
          회원제 서비스 이용에 따른 본인확인, 본인의 의사 확인, 고객 문의에 대한 응답, 새로운 정보의 소개 및 고지사항
          전달
          <br />
        </Text>
        <SMargin margin="60px 0px 0px 0px" />

        <SemiTItle>제2조 수집하는 개인정보 항목 및 수집 방법</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          회원 가입 시 또는 서비스 이용 과정에서 서비스 제공을 위해 필요 최소한의 개인정보를 수집하고 있습니다.
        </Text>
        <SMargin margin="20px 0px 0px 0px" />
        <Text style={{ fontWeight: 'bold' }}>[회원가입]</Text>
        <br />
        <Text>
          필수) 닉네임, 이메일, 성별, 생일
          <br />
          선택) 직군, 직무, 경력, 장소, 개인 성향, 이력서
        </Text>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>※ 소셜 계정으로만 회원가입이 가능하고, 플랫폼에서 제공하는 아래의 정보를 수집합니다.</Text>

        <br />
        <Text style={{ fontWeight: 'bold' }}>1) 카카오</Text>
        <br />
        <Text>
          필수) 회원 식별자 정보, 이메일
          <br />
          선택) 프로필 사진
        </Text>
        <br />
        <Text style={{ fontWeight: 'bold' }}>2) 구글</Text>
        <br />
        <Text>
          필수) 회원 식별자 정보, 이메일
          <br />
          선택) 프로필 사진
        </Text>
        <SMargin margin="20px 0px 0px 0px" />
        <Text style={{ fontWeight: 'bold' }}>[문의하기]</Text>
        <br />
        <Text>필수) 이메일</Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제3조 개인정보의 보유 및 이용기간</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          &ldquo;사이트&ldquo;는 회원가입일로부터 서비스를 제공하는 기간 동안에 한하여 이용자의 개인정보를 보유 및
          이용하게 됩니다. 개인정보의 수집 및 이용에 대한 동의를 철회하는 경우, 수집 및 이용목적이 달성되거나 이용기간이
          종료한 경우 개인정보를 지체 없이 파기합니다.
          <br />
          단, 다음의 경우에 대해서는 각각 명시한 이유와 기간 동안 보존합니다.
        </Text>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          1) 웹사이트 방문기록(로그인 기록, 접속기록): 1년
          <br />
          2) 부정이용 등에 관한 기록: 5년
          <br />
          3) 회원 탈퇴 요청 시, 탈퇴처리와 동시에 지체 없이 개인정보를 파기하는 것을 원칙으로 합니다. 단, 회원 가입 및
          탈퇴를 반복하여 서비스를 부정 이용하는 경우를 방지하기 위하여 탈퇴한 이용자의 최소한의 개인정보
          <Text style={{ fontWeight: 'bold' }}>(회원식별자정보, 이메일)</Text>를 6개월간 보관합니다.
          <br />
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제4조 이용자의 동의 없는 개인정보의 이용 및 제공</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          회사는 원칙적으로 이용자에게 동의 받은 범위 내에서만 개인정보를 이용 및 제공합니다. 다만, 「개인정보 보호법」
          제15조 제3항 또는 제17조 제4항에 따라 이용자의 동의 없이 개인정보를 추가적으로 이용·제공할 수 있습니다. 이
          경우, 회사는 정보주체의 동의 없는 개인정보의 추가적인 이용·제공을 위해 아래 사항을 고려하겠습니다.
        </Text>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          1) 당초 수집 목적과 관련성이 있는지 여부
          <br />
          2) 개인정보를 수집한 정황 또는 처리 관행에 비추어 볼 때 개인정보의 추가적인 이용 또는 제공에 대한 예측가능성이
          있는지 여부
          <br />
          3) 이용자의 이익을 부당하게 침해하는지 여부
          <br />
          4) 가명처리 또는 암호화 등 안전성 확보에 필요한 조치를 하였는지 여부
          <br />
        </Text>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          만약 개인정보의 추가적인 이용·제공이 지속적으로 발생하는 경우에는 위 사항에 대한 판단 기준을 공개하고, 해당
          기준의 준수 여부를 점검하겠습니다.
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제5조 가명정보의 처리</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          회사는 통계작성, 과학적 연구, 공익적 기록보존 등을 위하여 필요한 경우 수집한 개인정보를 특정 개인을 알아볼 수
          없도록 가명처리 합니다.
          <SMargin margin="20px 0px 0px 0px" />
          「개인정보 보호법」 제28조의 2부터 제38조의 7에 따라 가명정보의 처리·위탁·제3자 제공을 하는 경우, 본
          개인정보처리방침을 통하여 공개하겠습니다.
          <SMargin margin="20px 0px 0px 0px" />
          이때, 회사는 최소한의 항목을 가명처리하겠으며, 가명정보가 재식별되지 않도록 분리 및 관리하고 필요한 보호조치를
          취하겠습니다.
          <SMargin margin="20px 0px 0px 0px" />
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제6조 개인정보 파기절차 및 파기방법</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.
          &ldquo;회사&ldquo;의 개인정보 파기절차 및 방법은 다음과 같습니다.
        </Text>
        <SMargin margin="20px 0px 0px 0px" />
        <Text style={{ fontWeight: 'bold' }}>1) 파기절차</Text>
        <br />
        <Text>
          이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에
          따라 일정 기간 저장된 후 파기됩니다.
        </Text>
        <br />
        <Text style={{ fontWeight: 'bold' }}>2) 파기방법</Text>
        <br />
        <Text>
          종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통해 파기합니다. 전자적 파일형태로 저장된 개인정보는
          기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제7조 개인정보 자동 수집 장치의 설치, 운영 및 거부에 관한 사항</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          회사는 회원들에게 특화된 맞춤서비스 등을 제공하기 위해서 이용자의 정보를 수시로 저장하고 찾아내는
          &lsquo;쿠키(Cookie, 접속정보파일)&lsquo;를 운용합니다. 회사는 쿠키 운용과 관련하여 이용자의 컴퓨터는
          식별하지만 이용자를 개인적으로 식별하지는 않습니다.
        </Text>
        <SMargin margin="20px 0px 0px 0px" />

        <Text style={{ fontWeight: 'bold' }}>1) 쿠키란</Text>
        <br />
        <Text>
          웹사이트 운영 과정에서 서버는 이용자의 브라우저나 기기의 하드디스크에 저장될 작은 텍스트 파일을 보냅니다.
        </Text>
        <br />
        <Text style={{ fontWeight: 'bold' }}>2) 쿠키의 사용 목적</Text>
        <br />
        <Text>
          &ldquo;사이트&ldquo;가 쿠키를 통해 수집하는 정보는 &lsquo;제2조. 수집하는 개인정보 항목 및 수집방법&lsquo;과
          같으며, &lsquo;제1조. 개인정보의 수집 및 이용목적&lsquo; 외의 용도로는 이용되지 않습니다.
        </Text>
        <br />
        <Text style={{ fontWeight: 'bold' }}>3) 쿠키 설치, 운영 및 거부</Text>
        <br />
        <Text>
          이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나,
          쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
        </Text>
        <br />
        <Text>
          &ldquo;사이트&ldquo;가 쿠키를 통해 수집하는 정보는 &lsquo;제2조. 수집하는 개인정보 항목 및 수집방법&lsquo;과
          같으며, &lsquo;제1조. 개인정보의 수집 및 이용목적&lsquo; 외의 용도로는 이용되지 않습니다.
        </Text>
        <br />
        <Text>
          [설정 방법(Microsoft Edge)] : 도구 메뉴 {'>'} 설정 {'>'} 쿠키 및 사이트 권한 {'>'} 쿠키 및 사이트 데이터 관리
          및 삭제
          <br />
          [설정 방법(Chrome)] : 설정 메뉴 {'>'} 고급 설정 표시 {'>'} 개인정보 및 보안 {'>'} 사이트 설정 {'>'} 쿠키 및
          사이트 데이터 설정
          <br />
          [설정 방법(Firefox)] : 옵션 메뉴 {'>'} 개인정보 및 보안 {'>'} 쿠키 및 사이트 데이터 설정
          <br />
          [설정 방법(Safari)] : 환경설정 메뉴 {'>'} 개인정보 탭 {'>'} 쿠키 및 웹 사이트 데이터 수준 설정
          <br />
        </Text>
        <SMargin margin="20px 0px 0px 0px" />

        <Text>
          단, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 일부 서비스 이용에 어려움이 있을 수 있습니다.
          <br />
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제8조 개인정보의 안전성 확보조치에 관한 사항</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          &ldquo;회사&ldquo;는 이용자의 개인정보를 보호하기 위하여 최선의 노력을 다하고 있습니다. 단, 이용자의 개인적인
          부주의로 이메일(또는 카카오, 구글 등 외부 서비스와의 연동을 통해 이용자가 설정한 계정 정보), 비밀번호 등
          개인정보가 유출되어 발생한 문제와 기본적인 인터넷의 위험성 때문에 일어나는 일들에 대해 책임을 지지 않습니다.
          <br />
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제9조 링크</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          &ldquo;사이트&ldquo;는 다양한 배너와 링크를 포함할 수 있습니다. 많은 경우 타 사이트의 페이지와 연결되어 있으며
          이는 광고주와의 계약관계에 의하거나 제공받은 컨텐츠의 출처를 밝히기 위한 조치입니다. &ldquo;사이트&ldquo;가
          포함하고 있는 링크를 클릭하여 타 사이트의 페이지로 옮겨갈 경우 해당 사이트의 개인정보처리방침은 “사이트”와
          무관하므로 새로 방문한 사이트의 정책을 검토해 보시기 바랍니다.
          <br />
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제10조 아동의 개인정보 보호</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          &ldquo;회사&ldquo;는 프로젝트의 구성원 모집(또는 “팀 빌딩”) 특성으로 볼 때 만 14세 미만의 아동은 활동을 할 수
          없다고 판단하여 만 14세 미만 아동의 회원가입을 받지 않습니다.
          <br />
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제11조 비회원의 개인정보 보호</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          &ldquo;사이트&ldquo;에서는 회원 가입을 하지 않아도 개인정보와 이력서 주요 정보를 제외한 일부 컨텐츠를 열람할
          수 있습니다.
          <br />
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제12조 이용자의 권리와 그 행사방법</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          이용자는 언제든지 본인의 정보를, 법정대리인은 대리인의 정보를 열람, 공개 및 비공개 처리, 수정, 삭제할 수
          있습니다. 이용자 및 법정대리인은 개인정보 조회/수정/가입해지(동의철회)를 &lsquo;회원정보관리&lsquo;를 통해
          처리가 가능하며, 개인정보보호 책임자에게 이메일로 연락하시는 경우에는 본인 확인 절차를 거친 후 조치하겠습니다.
          <br />
          이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는
          제공하지 않습니다. 또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체 없이
          통지하여 정정이 이루어지도록 하겠습니다.
          <br />
          &ldquo;회사&ldquo;는 이용자 요청에 의해 해지 또는 삭제된 개인정보는 &lsquo;4. 개인정보의 보유 및
          이용기간&lsquo;에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
          <br />
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>제13조 개인정보 문의 및 민원서비스</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          &ldquo;회사&ldquo;는 이용자의 개인정보를 보호하고 개인정보와 관련한 고충처리를 이메일을 통해 문의 바랍니다.
          <br />
          이용자는 사이트의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자에게 신고하실
          수 있습니다. 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.
          <br />
        </Text>
        <Text style={{ fontWeight: 'bold' }}>담당자</Text>
        <br />
        <Text>정인용</Text>
        <br />
        <Text style={{ fontWeight: 'bold' }}>이메일</Text>
        <br />
        <Text>hoodiev.team@gmail.com</Text>
        <br />
        <SMargin margin="20px 0px 0px 0px" />

        <Text style={{ fontWeight: 'bold' }}>
          기타 개인정보에 관한 상담이 필요한 경우에는 아래 기관에 문의하실 수 있습니다.
          <br />
        </Text>
        <Text>
          개인정보침해신고센터: privacy.kisa.or.kr / 국번없이 118
          <br />
          대검찰청 사이버수사과: www.spo.go.kr / 국번없이 1301
          <br />
          경찰청 사이버범죄 신고시스템(ECRM): ecrm.police.go.kr / 국번없이 182
          <br />
          개인정보 분쟁조정위원회: www.kopico.go.kr / 1833-6972
          <br />
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>부칙</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          본 약관은 &lt;사이트 개설일&gt;부터 시행됩니다.
          <br />
        </Text>
      </PolicyLayout>
    </SContainer>
  );
}

export default PolicyPrivacy;
