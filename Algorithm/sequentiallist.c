#include<stdio.h>

int main()
{
	int i = 0;
	int sale[4] = { 10, 20, 30, 40 };
	int other[4] = { 0, };
	/*sale = other;
	오류 이유: other 배열변수가 가진 주소는 상수화되어 */

	for (i = 0; i < 4; i++)
	{
		printf("\n address: %u sale[%d] = %d", &sale[i], i, sale[i]);
	}
	printf("\n");
	int num[2][4] = { {10,20,30,40},
					  {50,60,70,80} };

	int* ptr = num; //int* ptr = &num[0][0];
	printf("num[0][1] = %d\n", num[0][1]);
	printf("*(ptr + 1) = %d\n", *(ptr + 1));
	printf("num[1][3] = %d\n", num[1][3]);
	printf("*(ptr + 7) = %d\n", *(ptr + 7));
	return 0;
}