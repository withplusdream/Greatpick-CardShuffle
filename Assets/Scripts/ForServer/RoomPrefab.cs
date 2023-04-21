using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class RoomPrefab : MonoBehaviour
{
    Button button;

    public int id;
    public string name;
    public Text RoomName;

    private void Awake()
    {
        button = GetComponent<Button>();
        button.onClick.AddListener(SelectRoom);
    }

    public void Init(int id_, string name_)
    {

        id = id_;
        name = name_;

        RoomName.text = name;
    }

    public void SelectRoom()
    {
        ServerManager.Instance.RoomSelected(id);
        SoundManager.instance.PlaySE("ServerClick");
        //여기서 해당 룸으로 접속
    }
}
