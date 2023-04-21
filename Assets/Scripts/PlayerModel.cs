using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

public class PlayerModel : MonoBehaviour
{
    [Header("PlayerInfo")]
    public string playerName;
    public int garnetCount;
    public Text playerText;
    public Text garnetText;
    public int playerIndex;

    [Header("Numbers")]
    public List<int> numbers;
    public LayoutGroup numbers_layoutGroup;
    public NumberFolder[] numberFolders;
    public List<int> sortedList;
    public int lastAdded;

    [Header("TurnCheck")]
    public Image backgroundImage;
    public bool isMyTurn;

    [Header("Score")]
    public GameObject score;
    public Text scoreText;
    public GameObject victory;
    public bool isVictory;

    public int NumberSum
    {
        get
        {
            if (numbers == null || numbers.Count == 0) return 0;
            return Utils.GetTotalCost(numbers);
        }
    }

    public int Result
    {
        get
        {
            return NumberSum + garnetCount;
        }
    }


    public void Initialize()
    {
        Debug.Log("player initialize");
        numbers = new List<int>();
        garnetCount = ServerManager.Instance.garnet_count;
        Debug.Log("garnet_count: " + ServerManager.Instance.garnet_count);
        lastAdded = 0;
        isVictory = false;
        score.SetActive(false);
        victory.SetActive(false);
        //ServerManager.Instance.SendChips(garnetCount);
    }

    //�÷��̾� �� ������Ʈ
    public void UpdateModel()
    {
        playerText.text = playerName;
        garnetText.text = garnetCount.ToString();

        //���� ����
        List<int> sortedList = new List<int>();
        sortedList.AddRange(numbers);
        sortedList = sortedList.OrderByDescending(x => x).ToList();
        var splitedList = Utils.GetSplitedList(sortedList);

        for (int i = 0; i < numberFolders.Length; i++)
        {
            if (splitedList.Count > i)
            {
                numberFolders[i].gameObject.SetActive(true);
                numberFolders[i].SetData(splitedList[i]);
            }
            else
            {
                numberFolders[i].gameObject.SetActive(false);
            }
        }
        LayoutRebuilder.ForceRebuildLayoutImmediate(numbers_layoutGroup.GetComponent<RectTransform>());

        //�������� �÷��̾� ǥ��
        if (isMyTurn == true)
        {
            DOTween.Kill(backgroundImage);
            backgroundImage.GetComponent<Image>().color = new Color(255 / 255f, 253 / 255f, 253 / 255f);
            backgroundImage.DOColor(new Color(255 / 255f, 233 / 255f, 233 / 255f), 0.5f).SetLoops(-1, LoopType.Yoyo);
        }
        else
        {
            DOTween.Kill(backgroundImage);
            backgroundImage.GetComponent<Image>().color = new Color(1, 1, 1);
        }

    }
    public void GetScore()
    {
        score.SetActive(true);
        score.transform.localScale = Vector3.zero;
        score.transform.DOScale(Vector3.one, .3f).SetEase(Ease.OutBack);
        scoreText.transform.localScale = Vector3.zero;
        scoreText.transform.DOScale(Vector3.one, .3f).SetEase(Ease.OutBack).SetDelay(1.2f); ;
        scoreText.text = string.Format("{0} + {1} = {2}", NumberSum, garnetCount, Result);

        if (isVictory)
        {
            victory.SetActive(true);
            victory.transform.localScale = Vector3.zero;
            victory.transform.DOScale(Vector3.one, .3f).SetEase(Ease.OutBack).SetDelay(3f);
        }
    }

    public int GetResult()
    {
        return 0;
    }
}