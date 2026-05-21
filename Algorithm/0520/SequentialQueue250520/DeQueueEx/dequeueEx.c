#include <stdio.h>
#include <windows.h>
#include "deQue.h"

int main(void)
{
	SetConsoleOutputCP(65001); //UTF-8,CP는 Code Page의 약자
	SetConsoleCP(65001); // 입력도 필요하면 설정

	DQueType* DQ1 = createDQue();  // 데크 생성
	element data;
	printf("\n ***** 데크 연산 ***** \n");
	printf("\n front 삽입 A>> ");  insertFront(DQ1, 'A');  printDQ(DQ1);
	printf("\n front 삽입 B>> ");  insertFront(DQ1, 'B');  printDQ(DQ1);
	printf("\n rear  삽입 C>> ");  insertRear(DQ1, 'C');  printDQ(DQ1);
	printf("\n front 삭제  >> ");  data = deleteFront(DQ1);    printDQ(DQ1);//
	printf("\t삭제 데이터: %c", data);
	printf("\n rear  삭제  >> ");  data = deleteRear(DQ1);     printDQ(DQ1);
	printf("\t\t삭제 데이터: %c", data);
	printf("\n rear  삽입 D>> ");  insertRear(DQ1, 'D');  printDQ(DQ1);
	printf("\n front 삽입 E>> ");  insertFront(DQ1, 'E');  printDQ(DQ1);
	printf("\n front 삽입 F>> ");  insertFront(DQ1, 'F');  printDQ(DQ1);

	printf("검색할 문자 입력 =");
	// Visual Studio 환경 등에서 발생하는 C4996 에러를 방지하기 위해 scanf 대신 scanf_s를 사용합니다.
	scanf_s(" %c", &data, (unsigned int)sizeof(data));

	DQNode* result = searchNode(DQ1, data);
	if (result != NULL) {
		printf("검색 성공: %c가 데크에 존재합니다.\n", result->data);
	} else {
		printf("검색 실패: %c를 찾을 수 없습니다.\n", data);
	}

	data = peekFront(DQ1);  printf("\n peek Front item : %c \n", data);
	data = peekRear(DQ1);  printf(" peek Rear item : %c \n", data);

	//getchar();  
	return 0;
}