<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon as Carbon;

class TaskResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $date = Carbon::parse($this->created_at)->format('d-m-Y H:i:s');

        return [
            'id'=>$this->id,
            'userId'=>$this->user_id,
            'title'=>$this->title,
            'descr'=>$this->description,
            'status'=>$this->status,
            'prior'=>$this->priority,
            'createdAt'=> $date,
        ];
    }
}
