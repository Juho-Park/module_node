import Papa from "papaparse";

async function parse(file: File) {
    return new Promise<any[]>((resolve, reject) => {
        Papa.parse(file, {
            header: true, // 첫 줄을 키(key)로 사용하여 객체 배열 생성
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: reject,
        });
    })
}

export default {
    parse
}

export { Papa }