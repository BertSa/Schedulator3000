package ca.bertsa.schedulator3000.converters;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class BooleanListConverter implements AttributeConverter<List<Boolean>, String> {

    private static final String SEPARATOR = ";";

    @Override
    public String convertToDatabaseColumn(List<Boolean> booleanList) {
        if (booleanList == null) {
            booleanList = getFalsyList();
        }

        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 7; i++) {
            Boolean aBoolean = i < booleanList.size() ? booleanList.get(i) : false;
            sb.append(aBoolean);

            if (i < 6) {
                sb.append(SEPARATOR);
            }
        }

        return sb.toString();
    }

    @Override
    public List<Boolean> convertToEntityAttribute(String booleansString) {
        if (booleansString == null || booleansString.isEmpty()) {
            return getFalsyList();
        }

        String[] pieces = booleansString.split(SEPARATOR);

        if (pieces.length == 0) {
            return getFalsyList();
        }

        List<Boolean> booleans = Arrays.stream(pieces)
                .map(Boolean::parseBoolean)
                .collect(Collectors.toList());
        if (booleans.size() > 7) {
            booleans = booleans.subList(0, 7);
        } else if (booleans.size() < 7) {
            while (booleans.size() < 7) {
                booleans.add(false);
            }
        }
        return booleans;
    }

    public static List<Boolean> getFalsyList() {
        final Boolean[] booleans = new Boolean[7];
        Arrays.fill(booleans, false);

        return Arrays.asList(booleans);
    }
}