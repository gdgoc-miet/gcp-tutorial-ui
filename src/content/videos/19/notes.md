# Event Notes

## How to Complete the Lab
- follow the instructions in the video
- one shot script to complete the lab

## Run the following Commands in CloudShell
- run the following command first
```bash
export ZONE=$(gcloud compute instances list lab-vm --format 'csv[no-heading](zone)')
gcloud compute ssh lab-vm --project=$DEVSHELL_PROJECT_ID --zone=$ZONE --quiet
```
- then Go to `Credentials` from here [link](https://console.cloud.google.com/apis/credentials)
```bash
export API_KEY=
export task_2_file_name=""
export task_3_request_file=""
export task_3_response_file=""
export task_4_sentence=""
export task_4_file=""
export task_5_sentence=""
export task_5_file=""
```
- finally run the script

```bash
curl -LO raw.githubusercontent.com/Cloud-Wala-Banda/Labs-Solutions/main/Cloud%20Speech%20API%203%20Ways%20Challenge%20Lab/arc132.sh

sudo chmod +x arc132.sh

./arc132.sh
```

> notes: USE CTRL + SHIFT + V to paste the copied command in Cloud Shell terminal