using Firesplash.UnityAssets.SocketIO;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ServerManager : MonoBehaviour
{
    public static ServerManager Instance { get { return instance; } }
    protected static ServerManager instance;

    [Header("Admin")]

    public GameObject AdminBtn;
    public bool isAdmin = false;
    public bool isTurn = false;
    public bool isLogin = false;
    public SocketIOCommunicator sioCom;
    //public GameSession gameSession;

    [Header("Pages")]
    public GameObject Pages;
    public GameObject intro;
    public GameObject managerLogin;
    public GameObject selectChannel;
    public GameObject enterCode;
    public GameObject selectRoom;
    public GameObject selectTeam;
    public GameObject playingBoard;
    public GameObject NextBtn;
    public GameObject SetPlayerChip;
    public GameObject Cover;
    public GameObject CoverSmall;

    [Header("Prefabs")]
    public GameObject Prefab_ChannelBtn;
    public GameObject Prefab_RoomBtn;
    public GameObject Prefab_TeamBtn;
    public GameObject Prefab_Player;

    [Header("Containers")]
    public GameObject ChannelContainer;
    public GameObject RoomContainer;
    public GameObject TeamContainer;
    public GameObject PlayerContainer_left;
    public GameObject PlayerContainer_right;


    [Header("Text")]
    public Text TeamName;


    int channel_id = -1;
    int room_id = -1;
    int team_id = -1;
    public int turn = 0;
    int team_index;
    int team_count;
    public int garnet_count;
    string current_page = "0_Logo";



    public void Awake()
    {
        instance = this;
    }

    //게임 실행할 때 서버 연결
    private void Start()
    {
        // sioCom = GetComponent<SocketIOCommunicator>();
        // initSocket();
        // if (isAdmin)
        // {
        //     NextBtn.SetActive(true);
        //     SetPlayerChip.SetActive(true);
        // }

    }

    //화면 다시 보는지 여부
    void OnApplicationFocus(bool hasFocus)
    {
        if (hasFocus && isLogin)
        {
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("room_id", room_id);
            data.AddField("team_id", team_id);

            sioCom.Instance.Emit("Focused", data.Print());
        }
    }

    /* ==서버와 통신 코드== */
    void initSocket()
    {
        sioCom.Instance.Connect();

        //연결
        sioCom.Instance.On("connect", (string jsondata) =>
        {
            Debug.Log("== Connected ============");
            //차후 동기화 할 때 수정할 코드
            //Disconnected.SetActive(false);

        });
        //재접속
        sioCom.Instance.On("LoadStatus", (string jsonData) =>
        {
            //isLogin = true;
            Debug.Log("LoadStatus: " + jsonData);
            JSONObject data = new JSONObject(jsonData);
            string current_page = data.GetField("current_page").str;
            List<JSONObject> used_cards = data.GetField("used_cards").list;
            List<JSONObject> ban_cards = data.GetField("ban_cards").list;
            int current_number = (int)data.GetField("current_value").n;
            int current_chip = (int)data.GetField("current_chip").n;
            int admin_click = (int)data.GetField("admin_click").n;
            turn = (((int)data.GetField("turn").n) % team_count) + 1;

            List<JSONObject> team_cards = data.GetField("team_cards").list;
            List<JSONObject> chip_list = data.GetField("chip_list").list;
            List<JSONObject> NumList = data.GetField("numList").list;

            GameManager.Instance.banCount = (int)data.GetField("ban_count").n;

            List<int> used_numbers = new List<int>();
            foreach (JSONObject number in used_cards)
            {
                int num = (int)number.n;
                used_numbers.Add(num);
            }

            List<int> ban_numbers = new List<int>();
            foreach (JSONObject card in ban_cards)
            {
                int num = (int)card.n;
                ban_numbers.Add(num);
            }

            List<int> numList = new List<int>();
            foreach (JSONObject num in NumList)
            {
                int n = (int)num.n;
                numList.Add(n);
            }

            GetTurn();

            GameManager.Instance.Rejoin(admin_click, team_cards, chip_list, numList, ban_numbers, used_numbers, current_page, current_number, current_chip);
        });

        //서버에서 1초마다 카드 새로고침 신호
        sioCom.Instance.On("UpdateCard",(string jsonData)=>
        {
            Debug.Log("UpdateCard");

            JSONObject data = new JSONObject(jsonData);
            List<JSONObject> team_cards = data.GetField("team_cards").list;

            GameManager.Instance.UpdateCard(team_cards);
        });

        //매니저 로그인
        sioCom.Instance.On("CheckLogin", (string jsonData) =>
        {
            Debug.Log("CheckLogin: " + jsonData);
            JSONObject data = new JSONObject(jsonData);
            if (data.GetField("success").b)
            {
                GoToPage("2_SelectChannel");
                //sioCom.Instance.Emit("GetChannels");
            }
        });
        //채널 가져오기
        sioCom.Instance.On("GetChannels", (string jsonData) =>
        {
            Debug.Log("GetChannels : " + jsonData);
            JSONObject data = new JSONObject(jsonData);
            List<JSONObject> groups = data.GetField("list").list;

            foreach (JSONObject group in groups)
            {
                int id = (int)group.GetField("id").n;
                string name = group.GetField("name").str;

                GameObject channelBtn = Instantiate(Prefab_ChannelBtn, ChannelContainer.transform);
                channelBtn.GetComponent<ChannelPrefab>().Init(id, name);
            }
        });
        //채널 패스워드 확인
        sioCom.Instance.On("CheckChannelPassword", (string jsonData) =>
        {
            Debug.Log("CheckChannelPassword: " + jsonData);
            JSONObject data = new JSONObject(jsonData);
            //서버에서 패스워드 맞으면
            if (data.GetField("success").b)
            {
                //GoToPage("SelectRoom");

                JSONObject data_ = new JSONObject(JSONObject.Type.OBJECT);
                data_.AddField("id", channel_id);
                sioCom.Instance.Emit("GetRooms", data_.Print());
                GoToPage("4_SelectRoom");
            }
        });
        //룸 가져오기
        sioCom.Instance.On("GetRooms", (string jsonData) =>
        {
            Debug.Log("GetRooms : " + jsonData);
            JSONObject data = new JSONObject(jsonData);
            List<JSONObject> groups = data.GetField("list").list;

            foreach (JSONObject group in groups)
            {
                int id = (int)group.GetField("id").n;
                string name = group.GetField("name").str;

                GameObject roomBtn = Instantiate(Prefab_RoomBtn, RoomContainer.transform);
                roomBtn.GetComponent<RoomPrefab>().Init(id, name);
            }
        });
        //조 가져오기
        sioCom.Instance.On("GetTeams", (string jsonData) =>
        {
            Debug.Log("GetTeams : " + jsonData);
            JSONObject data = new JSONObject(jsonData);
            List<JSONObject> groups = data.GetField("list").list;
            garnet_count = (int)data.GetField("garnet_count").n;

            foreach (JSONObject group in groups)
            {
                int id = (int)group.GetField("id").n;
                int index = (int)group.GetField("index").n;
                string name = group.GetField("name").str;

                GameObject teamBtn = Instantiate(Prefab_TeamBtn, TeamContainer.transform);
                teamBtn.GetComponent<TeamPrefab>().Init(id, index);
            }
            team_count = groups.Count;
            InitTeams();
        });

        //모든 팀 로그인 완료 시 GameManager의 isAllTeamLogin State를 바꿔줌
        sioCom.Instance.On("AllTeamLogin", (string jsonData) =>
        {
            Debug.Log("AllTeamLogin");
            GameManager.Instance.isAllTeamLogin = true;
        });

        //adminClick 한거 동기화
        sioCom.Instance.On("adminClick1", (string jsonData) =>
        {
            if (!isAdmin)
            {
                GameManager.Instance.GameSession1();
                Cover.SetActive(true);
            }
            GetTurn();
        });

        sioCom.Instance.On("adminClick2", (string jsonData) =>
        {
            if (!isAdmin)
            {
                GameManager.Instance.GameSession2();
                if (turn == team_index)
                    Cover.SetActive(false);
            }

        });

        sioCom.Instance.On("adminClick3", (string jsonData) =>
        {
            if (!isAdmin)
            {
                GameManager.Instance.GameSession3();
            }
        });

        //게임 끝났을 때 강제로 결과.. 나오게 할라 그런거긴.. 한데.. 안됌 ㅎ
        // sioCom.Instance.On("ForceEnd", (string jsonData) =>
        // {
        //     GameManager.Instance.ForceEnd();
        // });

        //서버에서 랜덤 순서 받기 
        sioCom.Instance.On("GetNumList", (string jsonData) =>
        {
            Debug.Log("GetNumList" + jsonData);
            JSONObject data = new JSONObject(jsonData);
            List<JSONObject> lists = data.GetField("numList").list;

            List<int> randomNumList = new List<int>();

            foreach (JSONObject list in lists)
            {
                int number = (int)list.n;
                randomNumList.Add(number);
            }
            Debug.Log("randomNumList: " + randomNumList);
            GameManager.Instance.SetRandomNumList(randomNumList);
        });

        sioCom.Instance.On("SetBanNumber", (string jsonData) =>
         {
             Debug.Log("SetBanNumber" + jsonData);
             JSONObject data = new JSONObject(jsonData);
             int value = (int)data.GetField("ban_number").n;

             GameManager.Instance.SetBanNumber(value);
         });

        //선택한 카드 숫자 받아오기 
        sioCom.Instance.On("GetValue", (string jsonData) =>
        {
            Debug.Log("GetValue" + jsonData);
            JSONObject data = new JSONObject(jsonData);
            int value = (int)data.GetField("value").n;

            GameManager.Instance.SetSelectedNumber(value);
        });
        //아이템 구매 시 동기화
        sioCom.Instance.On("GetBuyItem", (string jsonData) =>
         {
             Debug.Log("GetBuyItem" + jsonData);
             JSONObject data = new JSONObject(jsonData);

             GameManager.Instance.Btn_NumberOnBuy();
         });
        //아이템 거절 시 동기화
        sioCom.Instance.On("GetPassItem", (string jsonData) =>
        {
            Debug.Log("GetPassItem" + jsonData);
            JSONObject data = new JSONObject(jsonData);

            GameManager.Instance.Btn_NumberOnPass();
            // GetTurnAlone();
        });

        //차례 서버에서 가져오기 - 서버에 room에 저장
        sioCom.Instance.On("GetTurn", (string jsonData) =>
        {
            Debug.Log("GetTurn" + jsonData);
            JSONObject data = new JSONObject(jsonData);
            turn = (((int)data.GetField("turn").n) % team_count) + 1;

            Debug.Log("turn: " + turn);

            CoverOn();
        });

        //화면 볼때마다 동기화
        sioCom.Instance.On("Focused", (string jsonData) =>
        {
            Debug.Log("Focused" + jsonData);
            JSONObject data = new JSONObject(jsonData);

            GameManager.Instance.Reset();

            sioCom.Instance.Emit("Rejoin", data.Print());
        });

        //밴 되는 수 동기화
        sioCom.Instance.On("SendBanCount", (string jsonData) =>
        {
            Debug.Log("SendBanCount" + jsonData);
            JSONObject data = new JSONObject(jsonData);

            GameManager.Instance.banCount = (int)data.GetField("ban_count").n;
        });
    }


    // /*==함수 코드==*/

    //페이지 이동 코드 - GoToPage로 통일
    public void GoToPage(string page_name)
    {
        Debug.Log("current page: " + current_page);
        Debug.Log("page name: " + page_name);
        Pages.transform.Find(current_page).gameObject.SetActive(false);
        Pages.transform.Find(page_name).gameObject.SetActive(true);
        current_page = page_name;

        //서버 동기화 할 때 수정할 코드
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("team_id", team_id);
        data.AddField("page_name", page_name);
        data.AddField("isAdmin", isAdmin);
        data.AddField("room_id", room_id);
        // if ((team_id >= 0 && !isAdmin) || (RoomPrefab_DirectPlayingBoard >= 0 && isAdmin && current_page != "TeamName"))
        //     sioCom.Instance.Emit("SendCurrentpage", data.Print());
        if (team_id >= 0 && !isAdmin)
            sioCom.Instance.Emit("SendCurrentpage", data.Print());
    }

    //조 갯수만큼 팀 생성 
    public void InitTeams()
    {
        Debug.Log("InitTeams");
        for (int i = 1; i <= team_count; i++)
        {
            GameManager.Instance.CreatePlayerModel();
        }
    }


    /*==게임 프로세스순 코드==*/

    //매니저 로그인 확인
    public void SendLogin(string id, string password)
    {
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("id", id);
        data.AddField("password", password);

        Debug.Log("id: " + id);
        Debug.Log("password: " + password);

        sioCom.Instance.Emit("CheckLogin", data.Print());
    }

    //채널 가져오기 - 로고창에서 실행
    public void GetChannels()
    {
        sioCom.Instance.Emit("GetChannels");

        if (isAdmin)
            GoToPage("1_ManagerLogin");
        else

            GoToPage("2_SelectChannel");

        intro.SetActive(false);
        SoundManager.instance.PlaySE("Click");
    }


    //채널 선택 되고 채널 id값 부여
    public void ChannelSelected(int id)
    {
        channel_id = id;
        Debug.Log("Channal_id: " + channel_id);
    }

    //채널 패스워드 입력하면 서버로 보내는 코드
    public void SendChannelPassword(string channel_password)
    {
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("id", channel_id);
        data.AddField("channel_password", channel_password);

        Debug.Log("channel_password: " + channel_password);
        sioCom.Instance.Emit("CheckChannelPassword", data.Print());
        SoundManager.instance.PlaySE("Click");
    }

    //룸 선택 하고 id 부여
    public void RoomSelected(int id)
    {
        room_id = id;
        Debug.Log("RoomSelected: " + room_id);

        //관리자면 바로 게임창으로 이동
        if (isAdmin)
        {
            GoToPage("5_PlayingBoard");
            AdminBtn.SetActive(true);
        }
        else
            GoToPage("4.5_SelectTeam");

        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("room_id", room_id);
        data.AddField("isAdmin", isAdmin);
        sioCom.Instance.Emit("JoinRoom", data.Print());

        //ManagerRejoin();

    }


    public void ManagerRejoin()
    {
        if (isAdmin && room_id >= 0)
        {
            GetTurn();
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("room_id", room_id);
            data.AddField("isAdmin", isAdmin);
            if (team_id >= 0 && !isAdmin) data.AddField("team_id", team_id);
            sioCom.Instance.Emit("Rejoin", data.Print());
            Debug.Log("rejoin");
        }
    }

    //팀 선택 후 id 부여
    public void TeamSelected(int id, int index)
    {
        team_id = id;
        team_index = index;

        TeamName.text = team_index + "조";

        isLogin = true;

        if (room_id >= 0)
        {
            //다른 팀들이 가려져서 여기서는 하지말고 admin click 할 때만 해도 되는지 확인
            //GetTurn();
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("room_id", room_id);
            data.AddField("isAdmin", isAdmin);
            if (team_id >= 0 && !isAdmin) data.AddField("team_id", team_id);
            sioCom.Instance.Emit("Rejoin", data.Print());
            Debug.Log("rejoin");
        }

        JSONObject data_ = new JSONObject(JSONObject.Type.OBJECT);
        data_.AddField("team_id", team_id);

        sioCom.Instance.Emit("JoinTeam", data_.Print());

        GoToPage("5_PlayingBoard");
        Debug.Log("team_index: " + team_index);

    }


    //GameManager의 Btn_Admin을 눌렀을때 유저창에서도 같이 실행되게 - 3단계로 나눠서
    public void adminClick1()
    {
        Debug.Log("adminClick1");
        if (isAdmin)
        {
            SendRoomCurrentPage("adminClick1");
            
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("room_id", room_id);
            data.AddField("team_id", team_id);
            sioCom.Instance.Emit("adminClick1", data.Print());
        }

        if (!isAdmin) Cover.SetActive(true);
    }

    public void adminClick2()
    {
        Debug.Log("adminClick2");
        if (isAdmin)
        {
            SendRoomCurrentPage("adminClick2");

            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("room_id", room_id);
            sioCom.Instance.Emit("adminClick2", data.Print());
        }
    }

    public void adminClick3()
    {
        Debug.Log("adminClick3");
        if (isAdmin)
        {
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("room_id", room_id);
            sioCom.Instance.Emit("adminClick3", data.Print());
        }
    }

    //서버로 list보내기 테스트
    public void SendNumList(List<int> NumList_)
    {
        JSONObject NumList = new JSONObject(JSONObject.Type.ARRAY);
        foreach (int number in NumList_)
        {
            NumList.Add(number);
        }

        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("numList", NumList);
        data.AddField("room_id", room_id);

        sioCom.Instance.Emit("SendNumList", data.Print());
    }

    public void GetRemainedNumbers(List<int> NumList)
    {
        Debug.Log("GetRemainedNumbers");
        SendNumList(NumList);
    }

    //ban number 동기화!!!!!!
    public void SetBanNumber(int value)
    {
        if (isAdmin)
        {
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("ban_number", value);
            data.AddField("room_id", room_id);

            sioCom.Instance.Emit("SetBanNumber", data.Print());
        }
    }

    //선택한 카드 값 보내기
    public void SendValue(int value)
    {
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("value", value);
        data.AddField("room_id", room_id);
        data.AddField("team_id", team_id);

        sioCom.Instance.Emit("SendValue", data.Print());
    }

    //카드 선택시
    public void SendBuyItem()
    {
        if (turn == team_index)
        {
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("room_id", room_id);
            data.AddField("team_id", team_id);

            sioCom.Instance.Emit("SendBuyItem", data.Print());
        }
    }

    //카드 거절시
    public void SendPassItem()
    {
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("room_id", room_id);

        sioCom.Instance.Emit("SendPassItem", data.Print());
    }

    //서버에서 순서 가져오는 함수 - 처음이랑 패스마다 실행
    public void GetTurn()
    {
        Debug.Log("GetTurn");
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("room_id", room_id);

        sioCom.Instance.Emit("GetTurn", data.Print());
    }

    public void GetTurnAlone()
    {
        Debug.Log("GetTurnAlone");
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("room_id", room_id);

        sioCom.Instance.Emit("GetTurnAlone", data.Print());
    }

    //순서 카운트
    public void CountTurn()
    {
        if (isTurn && !isAdmin)
        {
            turn++;
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("room_id", room_id);
            data.AddField("turn", turn);

            sioCom.Instance.Emit("CountTurn", data.Print());
            Debug.Log("turn: " + turn);
        }
    }

    //순서 서버 저장
    public void InitTurn()
    {
        Debug.Log("InitTurn");
        isTurn = !isAdmin && ((turn % team_count) + 1) == team_index;
        //Cover.SetActive(!isTurn);

        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("isTurn", isTurn);
        data.AddField("team_id", team_id);

        sioCom.Instance.Emit("InitTurn", data.Print());
    }

    public void SendAdminClick(int adminClick)
    {
        Debug.Log("SendAdminClick: " + adminClick);
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("admin_click", adminClick);
        data.AddField("room_id", room_id);

        sioCom.Instance.Emit("SendAdminClick", data.Print());
    }

    public void SendSelectedNumber(int number)
    {
        Debug.Log("SendSelectedNumber: " + number);
        if (turn == team_index)
        {
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("team_id", team_id);
            data.AddField("selected_number", number);

            sioCom.Instance.Emit("SendSelectedNumber", data.Print());
        }
    }

    //기본 칩 셋팅 - 나중에 수정,, 일단은 디폴트 10으로
    // public void SendChips(int number)
    // {
    //     Debug.Log("SendChips: " + number);
    //     JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
    //     data.AddField("team_id", team_id);
    //     data.AddField("room_id", room_id);
    //     data.AddField("chips", number);

    //     sioCom.Instance.Emit("SendChips", data.Print());
    // }


    //게임 중 가넷 저장
    public void SendGarnet(int number)
    {
        if (turn == team_index)
        {
            Debug.Log("SendGarnet: " + number);
            JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
            data.AddField("team_id", team_id);
            data.AddField("room_id", room_id);
            data.AddField("Garnet", number);

            sioCom.Instance.Emit("SendGarnet", data.Print());
        }
        GetTurn();
    }

    //경매 중 가넷 저장
    public void SendAuctionGarnet(int number)
    {
        Debug.Log("SendAuctionGarnet: " + number);
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("room_id", room_id);
        data.AddField("Garnet", number);

        sioCom.Instance.Emit("SendAuctionGarnet", data.Print());
    }

    //커버 켜고 끄고,,
    public void CoverOn()
    {
        if (!isAdmin)
        {
            if (turn == team_index)
            {
                Debug.Log("CoverOff");
                Cover.SetActive(false);
                CoverSmall.SetActive(false);
            }
            else if (turn != team_index && current_page == "NumberBoardOn")
            {
                Debug.Log("CoverOn");
                CoverSmall.SetActive(false);
                Cover.SetActive(true);
            }
            else
            {
                Debug.Log("CoverSmallOn");
                Cover.SetActive(false);
                CoverSmall.SetActive(true);
            }
        }
    }

    public void CoverOnAdmin()
    {
        if (isAdmin)
        {
            Debug.Log("CoverOnAdmin");
            Cover.SetActive(true);
        }
    }

    public void SendRoomCurrentPage(string CurrentPage)
    {
        current_page = CurrentPage;
        Debug.Log("SendRoomCurrentPage: " + CurrentPage);
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("room_id", room_id);
        data.AddField("current_page", CurrentPage);

        sioCom.Instance.Emit("SendRoomCurrentPage", data.Print());
    }

    public void SendBanCount(int banCount)
    {
        Debug.Log("SendBanCount" + banCount);
        JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
        data.AddField("room_id", room_id);
        data.AddField("ban_count", banCount);

        sioCom.Instance.Emit("SendBanCount", data.Print());
    }


    // //인터랙션 있을때마다 업데이트 해주고 싶은데,, 이렇게 하니까 물린다
    // public void GameUpdate()
    // {
    //     if (room_id >= 0)
    //     {
    //         JSONObject data = new JSONObject(JSONObject.Type.OBJECT);
    //         data.AddField("room_id", room_id);
    //         data.AddField("isAdmin", isAdmin);
    //         if (team_id >= 0 && !isAdmin) data.AddField("team_id", team_id);
    //         sioCom.Instance.Emit("Rejoin", data.Print());
    //         Debug.Log("GameUpdate");
    //     }
    // }


}


