@extends('layouts.app')
@section('content')
<rim-editor
    :rim_in="{{json_encode($rim)}}"
    :dimension_names="{{json_encode($rim->dimension_names())}}"
>
</rim-editor>
@endsection
