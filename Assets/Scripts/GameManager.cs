
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get { return instance; } }
    protected static GameManager instance;

    [Header("Admin")]
    public int adminClick;
    public bool isAdmin = false;
    public GameObject AdminBtn;

    [Header("Pages")]
    public GameObject logo;
    public GameObject PasswordPage;


    [Header("PlayerManage")]
    public GameObject playerModelPrefab;
    public List<GameObject> playerModelPrefabs;
    public GameObject playerModelRootLeft;
    public GameObject playerModelRootRight;
    public int playerIndex;

    //public int defaultGarnetCount;

    [Header("NumberManage")]
    public List<int> remainedNumbers;
    public List<GameObject> numberModelPrefabs;
    public GameObject numberBoard;
    public GameObject numberModelPrefab;
    public GameObject numberModelRoot;

    //밴넘버
    public GameObject banNumberSetting;
    public int banCount = 2;
    public List<int> banNumbers;
    public Text banText;

    //경매에 오르는 넘버
    public int numberOnAuction;

    [Header("AuctionProcess")]
    public GameObject auctionBoard;
    public GameObject auctionNumberModel;
    public GameObject myTurnPlayer;

    public Text auctionGarnetText;
    public int auctionGarnetCount;
    public GameObject auctionNumberImageGroup;
    public GameObject auctionPassImageGroup;
    public GameObject auctionGarnetImageGroup;
    public GameObject auctionTimerGroup;
    public Button buyButton;

    public GameObject banNumberBoard;
    public GameObject banNumberRoot;

    [Header("State")]
    public bool isAuctionBoardOn = false;
    public bool isNumberBoardOn = false;
    public bool isAllTeamLogin = false;

    [Header("Timer")]
    public GameObject Timer;

    public InputField PasswordInput;


    public void Awake()
    {
        instance = this;
    }

    public void Btn_Logo_Out()
    {
        //Debug.Log("Btn_Logo_Out");
        logo.SetActive(false);
        ServerManager.Instance.GoToPage("5_PlayingBoard");
        GameSession1();
        AdminBtn.SetActive(true);
    }

    public void CheckPassword(){
        Debug.Log(PasswordInput.text);
        if(PasswordInput.text == "0920")
        {
            PasswordPage.SetActive(false);
            logo.SetActive(true);
        }
    }

    // --- Player에 관한 부분 --- //  // --- Player에 관한 부분 --- //  // --- Player에 관한 부분 --- //  // --- Player에 관한 부분 --- //  // --- Player에 관한 부분 --- // 
    public void ArrangePlayersRoot()
    {
        if (playerModelPrefabs.Count == 1)
        {
            playerModelPrefabs[0].transform.SetParent(playerModelRootLeft.transform, false);
        }

        if (playerModelPrefabs.Count == 2)
        {
            playerModelPrefabs[0].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[1].transform.SetParent(playerModelRootRight.transform, false);
        }

        if (playerModelPrefabs.Count == 3)
        {
            playerModelPrefabs[0].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[1].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[2].transform.SetParent(playerModelRootRight.transform, false);
        }

        if (playerModelPrefabs.Count == 4)
        {
            playerModelPrefabs[0].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[1].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[2].transform.SetParent(playerModelRootRight.transform, false);
            playerModelPrefabs[3].transform.SetParent(playerModelRootRight.transform, false);
        }

        if (playerModelPrefabs.Count == 5)
        {
            playerModelPrefabs[0].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[1].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[2].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[3].transform.SetParent(playerModelRootRight.transform, false);
            playerModelPrefabs[4].transform.SetParent(playerModelRootRight.transform, false);
        }

        if (playerModelPrefabs.Count == 6)
        {
            playerModelPrefabs[0].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[1].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[2].transform.SetParent(playerModelRootLeft.transform, false);
            playerModelPrefabs[3].transform.SetParent(playerModelRootRight.transform, false);
            playerModelPrefabs[4].transform.SetParent(playerModelRootRight.transform, false);
            playerModelPrefabs[5].transform.SetParent(playerModelRootRight.transform, false);
        }
    }


    public void CreatePlayerModel()
    {
        Debug.Log("CreatePlayerModel");

        if (playerModelPrefabs.Count >= 6)
        {
            print("6명이 최대 플레이어입니다.");
            return;
        }
        else
        {
            GameObject newPlayerModel = MonoBehaviour.Instantiate(playerModelPrefab, Vector3.zero, Quaternion.identity);
            playerModelPrefabs.Add(newPlayerModel);
            newPlayerModel.GetComponent<PlayerModel>().playerName = playerModelPrefabs.Count.ToString() + "조";
            newPlayerModel.GetComponent<PlayerModel>().playerIndex = playerModelPrefabs.Count();
            newPlayerModel.GetComponent<PlayerModel>().Initialize();
            newPlayerModel.transform.localScale = Vector3.one;
            ArrangePlayersRoot();
        }

        //플레이어 인덱스 설정
        playerIndex = 0;
        myTurnPlayer = playerModelPrefabs[playerIndex];
        UpdatePlayerModels();
    }

    //플레이어 모델 업데이트
    public void UpdatePlayerModels()
    {
        Debug.Log("Update Player Models");
        for (int i = 0; i < playerModelPrefabs.Count; i++)
        {
            playerModelPrefabs[i].GetComponent<PlayerModel>().UpdateModel();
        }
    }

    public void GetPlayerScore()
    {
        for (int i = 0; i < playerModelPrefabs.Count; i++)
        {
            playerModelPrefabs[i].GetComponent<PlayerModel>().GetScore();
        }
    }


    // --- 어드민 클릭 --- //  // --- 어드민 클릭 --- //  // --- 어드민 클릭 --- //  // --- 어드민 클릭 --- //  // --- 어드민 클릭 --- //  // --- 어드민 클릭 --- // 

    public void Btn_Admin()
    {  
        GameSession2();
    }

    //admin 버튼 클릭 시 사용 함수
    public void GameSession1()
    {
        Debug.Log("GameSession1");
        SoundManager.instance.PlaySE("NumberBoardDown");
        CreateNumberBoard();

    }

    public void GameSession2()
    {
        Debug.Log("GameSession2");
        if (isAdmin)
        {
            SoundManager.instance.PlaySE("Shuffle");
            ShuffleNumbers();
            SetNumbersToBlinded();
            SetNumbersValues();
            UpdateNumberModelsWithAnimation();
            NumberModelButtonOn();
            banNumberSetting.SetActive(true);
        }
        else
        {
            SoundManager.instance.PlaySE("Shuffle");
            //ShuffleNumbers();

            SetNumbersToBlinded();
            SetNumbersValues();
            UpdateNumberModelsWithAnimation();
            NumberModelButtonOn();
            banNumberSetting.SetActive(false);
        }
    }

    public void GameSession3()
    {
        Debug.Log("GameSession3");
        if (remainedNumbers.Count == banNumbers.Count)
        {
            SoundManager.instance.PlaySE("Score");
            // GetPlayerScore();

            StartCoroutine(
            Utils.WaitForInvoke(() =>
            {
                CreateBanNumberBoard();
                SoundManager.instance.PlaySE("Victory");
            }, 1.0f));

            //ServerManager.Instance.SendRoomCurrentPage("Result");
            //adminClick++;
        }
        else
        {
            print("게임이 아직 끝나지 않았습니다.");
            return;
        }
    }

    // public void ForceEnd()
    // {
    //     SoundManager.instance.PlaySE("Score");
    //     CreateBanNumberBoard();
    //     GetPlayerScore();

    //     StartCoroutine(
    //     Utils.WaitForInvoke(() =>
    //     {
    //         SoundManager.instance.PlaySE("Victory");
    //     }, 3f));

    //     ServerManager.Instance.SendRoomCurrentPage("Result");
    // }



    //--- NumberBoard 에 관 한 부분 ---//  //--- NumberBoard 에 관한 부분 ---//  //--- NumberBoard 에 관한 부분 ---//  //--- NumberBoard 에 관한 부분 ---//  //--- NumberBoard 에 관한 부분 ---// 

    //넘버 보드 생성에 관해서
    public void CreateNumberBoard()
    {
        //큐브 번호 생성
        for (int number = -4; number >= -35; number--)
        {
            remainedNumbers.Add(number);
        }
        // for (int number = -4; number >= -8; number--)
        // {
        //     remainedNumbers.Add(number);
        // }
        int order = 0;
        foreach (var number in remainedNumbers)
        {
            CreateNumberModel(number, order++);
        }
        UpdateNumberModel();
        NumberBoardOn();
    }

    //재접속했을때 다시 보드 생성
    public void CreateNumberBoardOnRejoin()
    {
        int order = 0;
        foreach (var number in remainedNumbers)
        {
            CreateNumberModel(number, order++);
        }
        UpdateNumberModel();
        //NumberBoardOn();
        numberBoard.SetActive(true);

        SetNumbersToBlinded();
        //UpdateNumberModelsWithAnimation();
        UpdateNumberModel();
        NumberModelButtonOn();
    }

    public void NumberBoardOn()
    {
        //Debug.Log("NumberBoardOn");
        numberBoard.SetActive(true);
        isNumberBoardOn = true;
        numberBoard.transform.localScale = Vector3.zero;
        numberBoard.transform.DOScale(Vector3.one, .6f).SetEase(Ease.OutBack);
    }
    public void NumberBoardOff()
    {
        //Debug.Log("NumberBoardOff");
        isNumberBoardOn = false;
        // StartCoroutine(
        //     Utils.WaitForInvoke(() =>
        //     {
        //         numberBoard.SetActive(false);
        //     }, 0.6f));

        numberBoard.transform.DOScale(Vector3.zero, .6f).SetEase(Ease.InBack);
    }

    //넘버 모델 생성
    public void CreateNumberModel(int number, int order)
    {
        GameObject newNumberModel = Instantiate(numberModelPrefab, Vector3.zero, Quaternion.identity);
        newNumberModel.transform.SetParent(numberModelRoot.transform, false);
        newNumberModel.transform.localScale = Vector3.one;
        newNumberModel.GetComponent<NumberModel>().index = order;
        newNumberModel.GetComponent<NumberModel>().SetData(number);
        numberModelPrefabs.Add(newNumberModel);
    }

    //넘버 모델 업데이트
    public void UpdateNumberModel()
    {
        for (int i = 0; i < numberModelPrefabs.Count; i++)
        {
            numberModelPrefabs[i].GetComponent<NumberModel>().UpdateNumberModel();
        }
    }

    //넘버 데이터 value 값 세팅
    public void SetNumbersValues()
    {
        for (int i = 0; i < numberModelPrefabs.Count; i++)
        {
            numberModelPrefabs[i].GetComponent<NumberModel>().SetData(remainedNumbers[i]);
        }
    }

    //넘버 데이터 blind 상태로 세팅 
    public void SetNumbersToBlinded()
    {
        foreach (var numberModel in numberModelPrefabs)
        {
            numberModel.GetComponent<NumberModel>().blinded = true;
        }
    }

    //애니메이션 트리거 - 넘버 모델 업데이트는 애니메이션 이벤트로
    public void UpdateNumberModelsWithAnimation()
    {
        for (int i = 0; i < numberModelPrefabs.Count; i++)
        {
            StartCoroutine(WaitAndSetTrigger(i * .07f, numberModelPrefabs[i].GetComponent<NumberModel>()));
        }
    }
    public IEnumerator WaitAndSetTrigger(float delay, NumberModel numberModel)
    {
        yield return new WaitForSeconds(delay);
        numberModel.GetComponent<Animator>().SetTrigger("UpDown");
    }

    //숫자 순서 셔플
    public void ShuffleNumbers()
    {
        Utils.Shuffle<int>(remainedNumbers);
        // foreach (int num in remainedNumbers)
        // {
        //     Debug.Log(num);
        // }
        //ServerManager.Instance.GetRemainedNumbers(remainedNumbers);
    }

    //밴 넘버의 갯수 설정
    public void Btn_PlusBanCount()
    {
        if (banCount < 10)
        {
            banCount++;
            //ServerManager.Instance.SendBanCount(banCount);
            banText.text = banCount.ToString();
        }
    }

    public void Btn_MinusBanCount()
    {
        if (banCount > 0 && banCount > banNumbers.Count)
        {
            banCount--;
            ServerManager.Instance.SendBanCount(banCount);
            banText.text = banCount.ToString();
        }
    }

    public void Btn_BanReset()
    {
        SoundManager.instance.PlaySE("Ban");
        foreach (var number in numberModelPrefabs)
        {
            number.GetComponent<NumberModel>().ban = false;
            banNumbers.Remove(number.GetComponent<NumberModel>().value);
        }
        UpdateNumberModel();
    }

    public void NumberModelButtonOn()
    {
        for (int i = 0; i < numberModelPrefabs.Count; i++)
        {
            numberModelPrefabs[i].GetComponent<Button>().enabled = true;
        }
    }
    public void NumberModelButtonOff()
    {
        for (int i = 0; i < numberModelPrefabs.Count; i++)
        {
            numberModelPrefabs[i].GetComponent<Button>().enabled = false;
        }
    }

    //넘버 모델 button에서 호출 : 클릭한 숫자 경매로 넘어가게 되는 부분
    public void NumberOnAuction(NumberModel numberModel)
    {
        Debug.Log("NumberOnAuction");
        if (numberModel.ban)
        {
            Debug.LogError("밴 카드 선택 금지");
            return;
        }
        else
        {
            SoundManager.instance.PlaySE("ClickNumber");
            NumberModelButtonOff();
            numberModel.blinded = false;
            numberModel.GetComponent<Animator>().SetTrigger("UpDown");
            numberOnAuction = numberModel.value;
            remainedNumbers.Remove(numberModel.value);

            StartCoroutine(
            Utils.WaitForInvoke(() =>
            {
                SoundManager.instance.PlaySE("NumberBoardDown");
                NumberBoardOff();
            }, 1.5f));

            StartCoroutine(
            Utils.WaitForInvoke(() =>
            {
                numberModel.hided = true;
                Debug.Log("NumberOnAuction WaitForInvoke");
                StartAuction();
            }, 2.5f));

            print(string.Format("{0}의 경매를 시작합니다", numberOnAuction));
            //ServerManager.Instance.SendRoomCurrentPage("OnAuction");
        }

        //한번만 실행되게 해야함
        //ServerManager.Instance.SendValue(numberOnAuction);

    }

    //위에 서버 매니저 함수 한번만 실행되게 하는거 찾아보기.. 일단은 함수 두개로
    public void NumberOnAuction2(NumberModel numberModel)
    {
        Debug.Log("NumberOnAuction");
        if (numberModel.ban)
        {
            Debug.LogError("밴 카드 선택 금지");
            return;
        }
        else
        {
            SoundManager.instance.PlaySE("ClickNumber");
            NumberModelButtonOff();
            numberModel.blinded = false;
            numberModel.GetComponent<Animator>().SetTrigger("UpDown");
            numberOnAuction = numberModel.value;
            remainedNumbers.Remove(numberModel.value);

            StartCoroutine(
            Utils.WaitForInvoke(() =>
            {
                SoundManager.instance.PlaySE("NumberBoardDown");
                NumberBoardOff();
            }, 1.5f));

            StartCoroutine(
            Utils.WaitForInvoke(() =>
            {
                numberModel.hided = true;
                Debug.Log("NumberOnAuction WaitForInvoke2");
                StartAuction();
            }, 2.5f));

            print(string.Format("{0}의 경매를 시작합니다", numberOnAuction));
            ServerManager.Instance.SendRoomCurrentPage("OnAuction");
        }

    }

    //--- AuctionProcess 에 관한 부분 ---//  //--- AuctionProcess 에 관한 부분 ---//  //--- AuctionProcess 에 관한 부분 ---//  //--- AuctionProcess 에 관한 부분 ---//  //--- AuctionProcess 에 관한 부분 ---// 

    public void StartAuction()
    {
        Debug.Log("StartAuction");
        buyButton.enabled = true;
        SoundManager.instance.PlaySE("Auction");
        //시작 플레이어의 턴 체크
        // myTurnPlayer.GetComponent<PlayerModel>().isMyTurn = true;
        // UpdatePlayerModels();

        //옥션보드의 큐브 숫자 연결
        AuctionBoardOn();
        auctionNumberModel.GetComponent<NumberModel>().SetData(numberOnAuction);
        auctionNumberModel.GetComponent<NumberModel>().UpdateNumberModel();

        //타이머
        //auctionTimerGroup.GetComponent<Timer>().StopWatchReset();
        //Timer.SetActive(true);
        //Timer.GetComponent<Timer>().StartTimer();

        if (isAuctionBoardOn == true && isNumberBoardOn == true)
        {
            AuctionBoardOff();
            UpdateNumberModel();

            NumberBoardOff();
            NumberBoardOn();

        }
    }


    public void AuctionBoardOn()
    {
        Debug.Log("AuctionBoardOn");
        auctionBoard.SetActive(true);
        //Timer.SetActive(true);
        isAuctionBoardOn = true;
        //UpdateAuctionGarnet();

        auctionNumberImageGroup.transform.localScale = Vector3.zero;
        auctionPassImageGroup.transform.localScale = Vector3.zero;
        auctionGarnetImageGroup.transform.localScale = Vector3.zero;
        auctionTimerGroup.transform.localScale = Vector3.zero;
        auctionNumberImageGroup.transform.DOScale(Vector3.one, .3f).SetEase(Ease.OutBack);
        auctionPassImageGroup.transform.DOScale(Vector3.one, .3f).SetEase(Ease.OutBack).SetDelay(.1f);
        auctionGarnetImageGroup.transform.DOScale(Vector3.one, .3f).SetEase(Ease.OutBack).SetDelay(.1f);
        auctionTimerGroup.transform.DOScale(Vector3.one, .3f).SetEase(Ease.OutBack).SetDelay(.1f);

        //ServerManager.Instance.CoverOn();
    }
    public void AuctionBoardOff()
    {
        Debug.Log("AuctionBoardOff");
        Timer.SetActive(false);
        isAuctionBoardOn = false;
        auctionNumberImageGroup.transform.DOScale(Vector3.zero, .3f).SetEase(Ease.InBack);
        auctionPassImageGroup.transform.DOScale(Vector3.zero, .3f).SetEase(Ease.InBack).SetDelay(.1f);
        auctionGarnetImageGroup.transform.DOScale(Vector3.zero, .3f).SetEase(Ease.InBack).SetDelay(.1f);
        auctionTimerGroup.transform.DOScale(Vector3.zero, .3f).SetEase(Ease.InBack).SetDelay(.1f);
    }

    public void AuctionBoardOffActive()
    {
        auctionBoard.SetActive(false);
    }


    //플레이어 인덱스를 통한 플레이어 턴 루프
    public void PlayerTurnLoop()
    {
        Debug.Log("PlayerTurnLoop");
        myTurnPlayer.GetComponent<PlayerModel>().isMyTurn = false;
        playerIndex++;
        if (playerIndex >= playerModelPrefabs.Count)
        {
            playerIndex = 0;
        }
        myTurnPlayer = playerModelPrefabs[playerIndex];
        myTurnPlayer.GetComponent<PlayerModel>().isMyTurn = true;

        if (myTurnPlayer.GetComponent<PlayerModel>().garnetCount == 0)
        {
            Btn_Buy();
        }

    }
    //무한루프 돌아서 한번 나눠보기..
    public void Btn_Buy()
    {
        ServerManager.Instance.SendBuyItem();
    }

    public void Btn_Pass()
    {
        ServerManager.Instance.SendPassItem();
    }

    public void Btn_NumberOnBuy()
    {        
        //Debug.Log("Btn_NumberOnBuy");
        SoundManager.instance.PlaySE("Buy");
        buyButton.enabled = false;
        //플레이어 데이터 변경 사항
        // myTurnPlayer.GetComponent<PlayerModel>().numbers.Add(numberOnAuction);
        // myTurnPlayer.GetComponent<PlayerModel>().garnetCount += auctionGarnetCount;
        // myTurnPlayer.GetComponent<PlayerModel>().lastAdded = numberOnAuction;
        // myTurnPlayer.GetComponent<Animator>().SetTrigger("Buy");
        // UpdatePlayerModels();
        // ServerManager.Instance.SendGarnet(myTurnPlayer.GetComponent<PlayerModel>().garnetCount);


        //옥션 가넷 변경 사항
        // auctionGarnetCount = 0;
        // ServerManager.Instance.SendAuctionGarnet(auctionGarnetCount);

        //옥션 보드 이미지 사라지는 트윈
        AuctionBoardOff();
        // Debug.Log("remainedNumbers.Count: " + remainedNumbers.Count);
        // Debug.Log("banNumbers.Count: " + banNumbers.Count);

        //타이머 멈춰
        //auctionTimerGroup.GetComponent<Timer>().StopWatchStop();

        //넘버 보드 온 만약 마지막 = 남은 큐브가 없으면 안뜨고 승자 계산
        if (remainedNumbers.Count == banNumbers.Count)
        {
            // myTurnPlayer.GetComponent<PlayerModel>().isMyTurn = false;
            // UpdatePlayerModels();

            // int victoryScore = playerModelPrefabs.Max(x => x.GetComponent<PlayerModel>().Result);
            // foreach (var player in playerModelPrefabs.Where(x => x.GetComponent<PlayerModel>().Result == victoryScore))
            // {
            //     player.GetComponent<PlayerModel>().isVictory = true;
            // }
            GameSession3();
        }
        else
        {
            StartCoroutine(WaitForOpen());
            //ServerManager.Instance.SendRoomCurrentPage("NumberBoardOn");
        }

        //ServerManager.Instance.SendSelectedNumber(numberOnAuction);

    }
    IEnumerator WaitForOpen()
    {
        yield return new WaitForSeconds(1.3f);
        NumberBoardOn();
        UpdateNumberModel();
        NumberModelButtonOn();
    }

    public void Btn_NumberOnPass()
    {
        Debug.Log("Btn_NumberOnPass");
        if (myTurnPlayer.GetComponent<PlayerModel>().garnetCount == 0)
        {
            return;
        }
        else
        {
            Timer.GetComponent<Timer>().StartTimer();
            SoundManager.instance.PlaySE("Garnet");
            //플레이어 데이터 변경 사항
            myTurnPlayer.GetComponent<PlayerModel>().garnetCount--;
            ServerManager.Instance.SendGarnet(myTurnPlayer.GetComponent<PlayerModel>().garnetCount);
            //옥션 가넷 변경 사항
            auctionGarnetCount++;
            UpdateAuctionGarnet();
            PlayerTurnLoop();
            UpdatePlayerModels();

            ServerManager.Instance.SendAuctionGarnet(auctionGarnetCount);
        }

        //auctionTimerGroup.GetComponent<Timer>().StopWatchReset();
    }

    public void UpdateAuctionGarnet()
    {
        auctionGarnetText.text = auctionGarnetCount.ToString();
        auctionGarnetImageGroup.GetComponent<Animator>().SetTrigger("pass");
    }

    public void CreateBanNumberBoard()
    {
        banNumberBoard.SetActive(true);
        banNumberBoard.transform.localScale = Vector3.zero;
        banNumberBoard.transform.DOScale(Vector3.one, .3f).SetEase(Ease.OutBack);
        foreach (var number in banNumbers)
        {
            GameObject banNumberModel = Instantiate(numberModelPrefab, Vector3.zero, Quaternion.identity);
            banNumberModel.transform.SetParent(banNumberRoot.transform, false);
            banNumberModel.GetComponent<NumberModel>().SetData(number);
            banNumberModel.GetComponent<NumberModel>().UpdateNumberModel();
        }
    }


    public void Reset()
    {
        Debug.Log("Reset");
        //플레이어 모델 리셋
        for (int i = 0; i < playerModelPrefabs.Count; i++)
        {
            playerModelPrefabs[i].GetComponent<PlayerModel>().Initialize();
        }
        UpdatePlayerModels();
        playerIndex = 0;
        myTurnPlayer = playerModelPrefabs[playerIndex];

        //넘버 보드 리셋
        Transform[] childList = numberModelRoot.GetComponentsInChildren<Transform>();
        for (int i = 1; i < childList.Length; i++)
        {
            Destroy(childList[i].gameObject);
        }
        //numberBoard.SetActive(false);

        numberModelPrefabs.RemoveAll(x => true);
        remainedNumbers.RemoveAll(x => true);
        banNumbers.RemoveAll(x => true);

        Transform[] childList2 = banNumberRoot.GetComponentsInChildren<Transform>();
        for (int i = 1; i < childList2.Length; i++)
        {
            Destroy(childList2[i].gameObject);
        }
        adminClick = 0;
        if (isAdmin) ServerManager.Instance.SendAdminClick(adminClick);
        banNumberBoard.SetActive(false);
    }


    // ---  동기화 부분!!!  --- // 

    //숫자 셔플 동기화
    public void SetRandomNumList(List<int> NumList)
    {
        Debug.Log("SetRandomNumList: " + NumList);
        remainedNumbers = NumList;
        Debug.Log(remainedNumbers);
        //GetRandomNumList();
    }

    //밴넘버 동기화
    public void SetBanNumber(int value)
    {
        if (!isAdmin)
        {
            Debug.Log("SetBanNumber" + value);
            foreach (var numberModel in numberModelPrefabs)
            {
                if (numberModel.GetComponent<NumberModel>().value == value)
                {
                    numberModel.GetComponent<NumberModel>().OnEventBan();
                }
            }
        }
    }

    //경매 선택 카드 동기화 (경매 같이 넘어가게)
    public void SetSelectedNumber(int value)
    {
        Debug.Log("SetSelectedNumber: " + value);
        foreach (var numberModel in numberModelPrefabs)
        {
            if (numberModel.GetComponent<NumberModel>().value == value)
            {
                numberModel.GetComponent<NumberModel>().Btn_OnClickNumberModel2();
            }
        }
    }

    //카드 업데이트
    public void UpdateCard(List<JSONObject> team_cards)
    {
        for (int i = 0; i < playerModelPrefabs.Count; i++)
        {
            playerModelPrefabs[i].GetComponent<PlayerModel>().numbers = new List<int>();
            foreach (JSONObject jo in team_cards[i].list)
            {
                Debug.Log((int)jo.n);
                playerModelPrefabs[i].GetComponent<PlayerModel>().numbers.Add((int)jo.n);
            }
        }
        UpdatePlayerModels();
    }

    //재접속시 초기 세팅
    public void Rejoin(int admin_click, List<JSONObject> team_cards, List<JSONObject> chip_list, List<int> numList, List<int> ban_numbers, List<int> used_numbers, string current_page, int current_number, int current_chip)
    {
        Debug.Log("Rejoin");

        //admin_click 동기화
        adminClick = admin_click;

        //플레이어 세팅
        for (int i = 0; i < playerModelPrefabs.Count; i++)
        {
            foreach (JSONObject jo in team_cards[i].list)
            {
                Debug.Log((int)jo.n);
                playerModelPrefabs[i].GetComponent<PlayerModel>().numbers.Add((int)jo.n);
            }
            //playerModelPrefabs[i].GetComponent<PlayerModel>().lastAdded = numberOnAuction;
        }
        for (int i = 0; i < playerModelPrefabs.Count; i++)
        {
            JSONObject jo = chip_list[i];
            Debug.Log((int)jo.n);
            playerModelPrefabs[i].GetComponent<PlayerModel>().garnetCount = (int)jo.n; ;
            //playerModelPrefabs[i].GetComponent<PlayerModel>().lastAdded = numberOnAuction;
        }
        UpdatePlayerModels();

        //카드 셋팅
        SetRandomNumList(numList);
        CreateNumberBoardOnRejoin();

        //remained number 세팅
        foreach (int num in used_numbers)
        {
            remainedNumbers.Remove(num);
        }

        //밴 셋팅
        banNumbers = ban_numbers;
        for (int i = 0; i < ban_numbers.Count; i++)
        {
            Debug.Log(ban_numbers[i]);
            foreach (var numberModel in numberModelPrefabs)
            {
                if (numberModel.GetComponent<NumberModel>().value == ban_numbers[i])
                {
                    Debug.Log(numberModel.GetComponent<NumberModel>().value);
                    numberModel.GetComponent<NumberModel>().ban = true;
                }
            }
        }

        //사용한 카드 숨기기
        foreach (int number in used_numbers)
        {
            foreach (var numberModel in numberModelPrefabs)
            {
                if (numberModel.GetComponent<NumberModel>().value == number)
                {
                    Debug.Log(numberModel.GetComponent<NumberModel>().value);
                    numberModel.GetComponent<NumberModel>().hided = true;
                }
            }
        }

        UpdateNumberModel();

        playerIndex = (ServerManager.Instance.turn - 1);
        Debug.Log(playerIndex);
        myTurnPlayer = playerModelPrefabs[playerIndex];

        numberOnAuction = current_number;

        if (current_page == "OnAuction")
        {
            Debug.Log("currentpage -> OnAuction");
            auctionGarnetCount = current_chip;
            NumberBoardOff();
            StartAuction();
        }
        else if (current_page == "adminClick1")
        {
            Debug.Log("currentpage -> adminClick1");

            //GameSession1();
        }
        else if (current_page == "adminClick2")
        {
            Debug.Log("currentpage -> adminClick2");

            GameSession2();
        }
        else if (current_page == "NumberBoardOn")
        {
            Debug.Log("currentpage -> NumberBoardOn");

            NumberBoardOn();
            AuctionBoardOff();
        }
        else if (current_page == "Result")
        {
            Debug.Log("currentpage -> Result");

            NumberBoardOff();
            if (remainedNumbers.Count == banNumbers.Count)
            {
                myTurnPlayer.GetComponent<PlayerModel>().isMyTurn = false;
                UpdatePlayerModels();

                int victoryScore = playerModelPrefabs.Max(x => x.GetComponent<PlayerModel>().Result);
                foreach (var player in playerModelPrefabs.Where(x => x.GetComponent<PlayerModel>().Result == victoryScore))
                {
                    player.GetComponent<PlayerModel>().isVictory = true;
                }

                SoundManager.instance.PlaySE("Score");
                CreateBanNumberBoard();
                GetPlayerScore();

                StartCoroutine(
                Utils.WaitForInvoke(() =>
                {
                    SoundManager.instance.PlaySE("Victory");
                }, 3f));
            }
        }
        // if (numberBoard.activeSelf)
        // {
        //     AuctionBoardOff();
        // }
    }
}

