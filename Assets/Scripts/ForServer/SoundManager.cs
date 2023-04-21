using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class Sound
{
    public string soundName;
    public AudioClip clip;
}
public class SoundManager : MonoBehaviour
{
    public static SoundManager instance;

    [Header("사운드 등록")]
    [SerializeField] Sound[] sfxSounds;
    public AudioSource[] sfxPlayer;
    

    public void Start()
    {
        instance = this;
    }

    public void PlaySE(string _soundName)
    {
        for(int i=0; i<sfxSounds.Length; i++)
        {
            if(_soundName == sfxSounds[i].soundName)
            {
                for(int x = 0; x<sfxPlayer.Length; x++)
                {
                    if(!sfxPlayer[x].isPlaying)
                    {
                        sfxPlayer[x].clip =sfxSounds[i].clip;
                        sfxPlayer[x].Play();
                        return;
                    }
                }
                return;
            }
        }
        
    }
}
