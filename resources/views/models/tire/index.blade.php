@extends('layouts.app_simple')
@section('content')
<tire-editor
    :tire_in="{{json_encode($tire)}}"
    :dimension_names="{{json_encode($tire->dimension_names())}}"
>
</tire-editor>
@endsection
