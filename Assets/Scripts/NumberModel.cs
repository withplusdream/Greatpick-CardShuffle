using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
public class NumberModel : MonoBehaviour, IDropHandler
{
    [Header("Number")]
    public int value;
    //blind할 때 활용
    public int index;

    //넘버모델 상태 체크
    [Header("NumberState")]
    public bool blinded;
    public bool ban;
    public bool hided;

    [Header("NumberModelImageUpdate")]
    public Text modelText;
    public GameObject banImage;




    //모델의 숫자 데이터 연결
    public void SetData(int value)
    {
        this.value = value;
    }
    //넘버 모델 업데이트
    public void UpdateNumberModel()
    {
        if (hided)
        {
            this.transform.localScale = Vector3.zero;
        }
        else
        {
            this.transform.localScale = Vector3.one;
        }

        if (ban)
        {
            banImage.SetActive(true);
            modelText.text = "";
        }
        else
        {
            banImage.SetActive(false);
            modelText.text = value.ToString();
        }
        if (blinded)
        {
            this.modelText.text = Utils.blindedValue[index];
        }
        else
        {
            modelText.text = value.ToString();
        }
        if (ban && blinded)
        {
            banImage.SetActive(true);
            modelText.text = "";
        }
    }

    //클릭시 경매로 넘어감
    public void Btn_OnClickNumberModel()
    {
        //Debug.Log("Btn_OnClick");
        if (GameManager.Instance.banCount == GameManager.Instance.banNumbers.Count)
        {
            GameManager.Instance.NumberOnAuction(gameObject.GetComponent<NumberModel>());
        }
        else
        {
            Debug.Log(GameManager.Instance.banCount);
            Debug.Log(GameManager.Instance.banNumbers.Count);

            print("밴을 설정해주세요");
            return;
        }
    }

    //얘도 일단.. 두번돌아서..
    public void Btn_OnClickNumberModel2()
    {
        if (GameManager.Instance.banCount == GameManager.Instance.banNumbers.Count)
        {
            GameManager.Instance.NumberOnAuction2(gameObject.GetComponent<NumberModel>());
        }
        else
        {
            print("밴을 설정해주세요");
            return;
        }
    }

    //밴 넘버 드랍시 밴카운트, 밴중복 체크 
    public void OnDrop(PointerEventData eventData)
    {
        if (GameManager.Instance.banNumbers.Count >= GameManager.Instance.banCount)
        {
            Debug.LogError("밴 갯수 초과");
            return;
        }

        if (GameManager.Instance.banNumbers.Contains(value))
        {
            Debug.LogError("중복 밴");
            return;
        }
        OnEventBan();
        print("ban : " + value);
    }

    //넘버 데이터에 밴 적용
    public void OnEventBan()
    {
        SoundManager.instance.PlaySE("Ban");
        ban = true;
        GameManager.Instance.banNumbers.Add(value);
        //ServerManager.Instance.SetBanNumber(value);
        UpdateNumberModel();

        // if (GameManager.Instance.banNumbers.Count == GameManager.Instance.banCount)
        // {
        //     //매니저 커버 켜져서 클릭 안되게
        //     ServerManager.Instance.CoverOnAdmin();
        //     //1조 커버 꺼지게
        //     ServerManager.Instance.CoverOn();
        // }
    }
}