using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ChannelPrefab : MonoBehaviour
{
    public Button button;
    public int id;
    public string name;
    public Text ChannelName;

    public void Awake()
    {
        button = GetComponent<Button>();
        button.onClick.AddListener(SelectChannel);
    }

    public void Init(int id_, string name_)
    {
        id = id_;
        name = name_;

        ChannelName.text = name;
    }

    public void SelectChannel()
    {
        // ForServer.Instance.selectChannel.SetActive(false);
        // ForServer.Instance.enterCode.SetActive(true);
        ServerManager.Instance.GoToPage("3_EnterCode");
        SoundManager.instance.PlaySE("ServerClick");
        ServerManager.Instance.ChannelSelected(id);
        //여기서 해당 채널로 접속
    }
}
