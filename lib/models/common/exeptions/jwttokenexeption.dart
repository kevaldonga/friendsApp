class JwtTokenExeption implements Exception {
  String cause;

  JwtTokenExeption(this.cause);
}
