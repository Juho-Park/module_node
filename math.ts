/** usage example
 * 
// 예제 태그
const tagsA = ["A", "B", "C",'D','E','F','G'];
const tagsB = ['A'];

// 모든 태그 집합 생성
const allTags = [...new Set([...tagsA, ...tagsB])];

// 벡터화
const vectorA = createVector(allTags, tagsA);
const vectorB = createVector(allTags, tagsB);

// 코사인 유사도 계산
const similarity = cosineSimilarity(vectorA, vectorB);
console.log("Cosine Similarity:", similarity);
 */
function cosineSimilarity(vecA: number[], vecB: number[]) {
    // 벡터 내적 계산
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);

    // 벡터의 크기 계산
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    // 코사인 유사도 계산
    return dotProduct / (magnitudeA * magnitudeB);
}

// 태그 데이터를 벡터로 변환
function createVector(allTags: string[], tags: string[]) {
    return allTags.map(tag => (tags.includes(tag) ? 1 : 0));
}