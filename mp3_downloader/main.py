import json
from yt_dlp import YoutubeDL


def main():
    with open('../fixed_records.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        cnt = 0
        errors = []
        for record in data:
            cnt = cnt + 1
            video_id = record['video_id']
            video_name = record['video_title']
            print(cnt, video_name)
            ydl_opts = {
                "outtmpl": f"./music/{video_id}",
                "format": "mp3/bestaudio/best",
                "postprocessors": [
                    {
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "mp3",
                    }
                ],
            }
            with YoutubeDL(ydl_opts) as ydl:
                urls = [f'https://www.youtube.com/watch?v={video_id}']
                print(urls)
                try:
                    error = ydl.download(urls)
                    if error:
                        errors.append(f"Error: {cnt}: {video_id}: {error}")
                except:
                    errors.append(f"Except: {cnt}: {video_id}")
        print(errors)


    return


if __name__ == '__main__':
    main()
