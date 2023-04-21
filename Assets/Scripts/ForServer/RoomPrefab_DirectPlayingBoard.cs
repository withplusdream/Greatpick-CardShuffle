using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class RoomPrefab_DirectPlayingBoard : MonoBehaviour
{
    Button button;

    private void Awake()
    {
        button = GetComponent<Button>();
        button.onClick.AddListener(SelectRoom);
    }

    public void SelectRoom()
    {
        ServerManager.Instance.selectRoom.SetActive(false);
        //ForServer.Instance.selectTeam.SetActive(true);

        ServerManager.Instance.playingBoard.SetActive(true);
        SoundManager.instance.PlaySE("ServerClick");
        //여기서 해당 룸으로 접속
    }
}
