using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;
public class NumberFolder : MonoBehaviour
{
    public NumberModel[] numberModels;
    public List<int> sortedList;
    public LayoutGroup layoutGroup;

    //�� ������ splitedList ���� ����
    public void SetData(List<int> cubeNumbers)
    {
        //splitedList[i] ������ ���ڵ� ����Ʈ
        sortedList = cubeNumbers;
        UpdateNumberFolder();
    }

    public void UpdateNumberFolder()
    {
        for(int i = 0 ; i < numberModels.Length; i ++)
        {
            //splitedList�� ���� ������ŭ numberModels ��
            if (i >= sortedList.Count)
            {
                numberModels[i].gameObject.SetActive(false);
            }
            else
            {
                numberModels[i].SetData(sortedList[i]);
                numberModels[i].UpdateNumberModel();
                numberModels[i].gameObject.SetActive(true);

                bool tween = false;
                tween = numberModels[i].value == GameManager.Instance.myTurnPlayer.GetComponent<PlayerModel>().lastAdded;
                if (tween)
                {
                    numberModels[i].gameObject.transform.localScale = Vector3.zero;
                    numberModels[i].gameObject.transform.DOScale(Vector3.one, .15f).SetEase(Ease.OutBack).SetDelay(.5f);
                    GameManager.Instance.myTurnPlayer.GetComponent<PlayerModel>().lastAdded = 0;
                }
            }
        }
        LayoutRebuilder.ForceRebuildLayoutImmediate(layoutGroup.GetComponent<RectTransform>());
    }
}