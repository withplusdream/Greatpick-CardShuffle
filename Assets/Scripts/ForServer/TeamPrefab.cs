using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TeamPrefab : MonoBehaviour
{
    Button button;

    public int id;
    public int index;
    public Text TeamName;

    private void Awake()
    {
        button = GetComponent<Button>();
        button.onClick.AddListener(SelectTeam);
    }

    public void Init(int id_, int index_)
    {
        id = id_;
        index = index_;

        TeamName.text = index + "조";
    }

    public void SelectTeam()
    {
        ServerManager.Instance.TeamSelected(id, index);
        // ForServer.Instance.selectTeam.SetActive(false);
        // ForServer.Instance.playingBoard.SetActive(true);
        SoundManager.instance.PlaySE("ServerClick");
        //여기서 해당 룸으로 접속
    }
}
