import {Alert, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {pick, types} from '@react-native-documents/picker';
import {RNDocumentCreator} from './NativeModules';
import assets from '../default_assets';

/* ----- saved json format start ----- */
const APP_SYMBOL = 'heartwarming';
const savedJsonFormat = {
  symbol: APP_SYMBOL,
  data: [],
};
/* ----- saved json format end ------- */

const putData = data => {
  savedJsonFormat['data'] = data;
};

const checkAppData = data => {
  const hasKeySymbol = data.hasOwnProperty('symbol');
  const hasKeyData = data.hasOwnProperty('data');
  let checkSymbol = false;
  if (hasKeySymbol) {
    checkSymbol = data['symbol'] === APP_SYMBOL;
  }

  const checkResult = hasKeySymbol & hasKeyData & checkSymbol;
  if (!checkResult) {
    Alert.alert('Heartwarming App 파일이 아닙니다.');
  }
  return checkResult;
};

const pickJsonFile = async () => {
  try {
    const [pickResult] = await pick({
      // 구형 기기(API 27 이하)는 모든 파일 허용, 최신 기기는 JSON/텍스트 허용
      type:
        Platform.OS === 'android' && Platform.Version < 28
          ? ['*/*']
          : [types.json, 'text/plain'],

      // 권한 에러 없이 읽기 위해 시스템 캐시로 임시 복사 (안드로이드 필수)
      copyTo: 'cachesDirectory',
    });

    const fileName = pickResult.name || '';

    // 확장자 검사 (대소문자 무시)
    if (fileName.toLowerCase().endsWith('.json')) {
      // 캐시로 복사된 안전한 경로 반환 (혹시 모를 에러 대비 원본 uri 폴백)
      return pickResult.fileCopyUri || pickResult.uri;
    } else {
      Alert.alert('알림', '확장자가 .json인 파일을 선택하세요.');
      return null;
    }
  } catch (err) {
    const errorMessage = err?.message || String(err);

    if (
      errorMessage.toLowerCase().includes('cancel') ||
      errorMessage.includes('DOCUMENT_PICKER_CANCELED')
    ) {
      console.log('사용자가 파일 선택을 취소했습니다.');
      return null;
    }

    console.log('Picker Error:', err);
    Alert.alert('오류', '파일을 선택하는 중 문제가 발생했습니다.');
    return null;
  }
};

const exportData = async (fileName, data) => {
  try {
    // 1. 전역 변수 오염을 막기 위해 내보낼 객체를 즉석에서 조립합니다.
    const exportPayload = {
      symbol: savedJsonFormat.symbol,
      data: data, // 파라미터로 받은 최신 데이터를 주입
    };

    // 2. 파일 생성 (저장) 창을 띄웁니다.
    const result = await RNDocumentCreator.createDocument(
      fileName,
      'json',
      JSON.stringify(exportPayload),
    );

    // 3. 파일 생성 결과 분기 (0: 성공)
    if (result === 0) {
      console.log('Export Success');
      // Alert.alert('알림', '데이터가 성공적으로 저장되었습니다.'); // 성공 알림이 필요하면 주석 해제
    } else {
      console.log('Export failed or cancelled with code:', result);
    }
  } catch (err) {
    const errorMessage = err?.message || String(err);

    // 4. [핵심] 사용자가 뒤로 가기(취소)를 눌렀을 때 에러 알럿을 띄우지 않고 조용히 종료합니다.
    if (errorMessage.toLowerCase().includes('cancel')) {
      console.log('사용자가 내보내기(저장)를 취소했습니다.');
      return;
    }

    // 5. 실제 시스템 오류가 발생했을 때만 경고 알럿 노출
    console.log('Export Error:', err);
    Alert.alert('오류', '데이터를 내보내는 중 문제가 발생했습니다.');
  }
};

// 앱으로부터 만들어진 파일인지 체크하는 기능 추가. symbol 체크
const importData = async () => {
  let data = [];
  try {
    // 1. 파일 선택창 띄우기 (권한 로직은 pickJsonFile 내에서 캐시 복사로 대체됨)
    const pickedJsonFile = await pickJsonFile();
    if (!pickedJsonFile) return data; // 선택 안 했으면 바로 종료 (Early Return)

    // 2. 파일 읽기 및 파싱
    const pickedData = await RNFS.readFile(pickedJsonFile);
    const parsedData = JSON.parse(pickedData); // 형식이 깨졌으면 여기서 catch로 넘어감
    const isAppData = checkAppData(parsedData); // 앱 심볼 검증 (기존에 만드신 함수)

    // 3. 앱 데이터 무결성 검증 (배열을 돌기 전에 차단!)
    if (!isAppData || !parsedData.data) {
      Alert.alert(
        '데이터 복원 실패',
        '올바른 백업 데이터가 아닙니다. 앱에서 내보낸 정상적인 파일을 선택해 주세요.',
      );
      return data;
    }

    let bgImageNum = 1;
    let infoAlert = false;

    // 4. 안전이 검증된 데이터 순회 및 배경 이미지 번호 재할당
    parsedData.data.forEach(element => {
      for (let key in element) {
        const setting = element[key]?.setting;

        if (
          setting &&
          setting.bgImage !== 1 &&
          setting.bgImage !== 2 &&
          setting.bgImage !== 3
        ) {
          if (!infoAlert) {
            Alert.alert(
              '알림',
              '이전에 배경이미지를 설정한 경우 앱의 기본이미지로 초기화됩니다.',
            );
            infoAlert = true;
          }

          // 객체 직접 참조를 통해 깔끔하게 값 수정
          setting.bgImage = bgImageNum;
          bgImageNum =
            bgImageNum >= assets.NUM_DEFAULT_IMAGE ? 1 : bgImageNum + 1;
        }
      }
    });

    // 5. 최종 데이터 할당
    data = parsedData.data;
  } catch (err) {
    const errorMessage = err?.message || String(err);

    // JSON.parse() 에러(문법 오류)인지, 그냥 읽기 에러인지 분기 처리
    if (
      err instanceof SyntaxError ||
      errorMessage.includes('JSON Parse error')
    ) {
      Alert.alert(
        '데이터 복원 실패',
        '올바른 백업 데이터가 아닙니다. 앱에서 내보낸 정상적인 파일을 선택해 주세요.',
      );
    } else {
      console.log('Import Error:', err);
      Alert.alert('오류', '파일을 읽는 중 문제가 발생했습니다.');
    }
  }

  return data;
};

const createFileName = header => {
  const paddingSize = 2;
  const paddingChar = '0';

  const year = new Date().getFullYear().toString(); //To get the Current Year

  let month = new Date().getMonth() + 1; //To get the Current Month
  month = month.toString().padStart(paddingSize, paddingChar);

  let date = new Date().getDate(); //To get the Current Date
  date = date.toString().padStart(paddingSize, paddingChar);

  let hour = new Date().getHours(); //To get the Current Hours
  hour = hour.toString().padStart(paddingSize, paddingChar);

  let min = new Date().getMinutes(); //To get the Current Minutes
  min = min.toString().padStart(paddingSize, paddingChar);

  let sec = new Date().getSeconds(); //To get the Current Seconds
  sec = sec.toString().padStart(paddingSize, paddingChar);

  const createdFileName = header + '_' + year + month + date + hour + min + sec;

  //console.log(createdFileName);

  return createdFileName;
};

export {exportData, importData, createFileName};
