main() {
  # -z: returns true when value is empty.
  if [[ -z "${MYCELIUM_MONOREPO}" ]]; then
    echo "MYCELIUM_MONOREPO environment variable is not set."
    exit 1
  fi
}

main "${@}" || exit 1
