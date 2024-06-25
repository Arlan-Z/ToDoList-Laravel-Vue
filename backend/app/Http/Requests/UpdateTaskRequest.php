<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     *
     */
    public function rules(): array
    {
        $method = $this->method();

        if($method == 'PUT') {
            return [
                'userId' => ['required', 'exists:users,id'],
                'title' => ['required', 'string', 'max:255'],
                'descr' => ['sometimes'],
                'status'=> ['required', Rule::in(['To Do', 'In Progress', 'Done'])],
                'prior' =>['required', Rule::in(['Low', 'Medium', 'High'])],
            ];
        } else{
            return [
                'userId' => ['sometimes','required', 'exists:users,id'],
                'title' => ['sometimes', 'required', 'string', 'max:255'],
                'descr' => ['sometimes'],
                'status'=> ['sometimes', 'required', Rule::in(['To Do', 'In Progress', 'Done'])],
                'prior' =>['sometimes', 'required', Rule::in(['Low', 'Medium', 'High'])],
            ];
        }
    }

    protected function prepareForValidation(){
        $arrForMerge = [];
        if ($this->userid) {
            $arrForMerge['user_id'] = $this->userId;
        }
        if ($this->descr) {
            $arrForMerge['description'] = $this->descr;
        }
        if ($this->prior) {
            $arrForMerge['priority'] = $this->prior;
        }

        $this->merge($arrForMerge);

//        $this->merge([
//            'user_id' => $this->userId,
//            'description' => $this->descr,
//            'priority' => $this->prior
//        ]);
    }
}
